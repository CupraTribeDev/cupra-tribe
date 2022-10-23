import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import queryString from 'query-string';
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinningDiv = styled.div`
    animation: 1.5s ${rotate} linear infinite;
`;

const dotsFlashing = keyframes`
  0% {
    background-color: #95572b;
  }
  50%,
  100% {
    background-color: #d9cebd;
  }
`;

const DotsFlashing = styled.div`
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: #95572b;
    color: #95572b;
    animation: ${dotsFlashing} 1s infinite linear alternate;
    animation-delay: .5s;

    &:before{
	content: '';
	display: inline-block;
	position: absolute;
	top: 0;
	left: -15px;
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: #95572b;
	color: #95572b;
	animation: ${dotsFlashing} 1s infinite alternate;
	animation-delay: 0s;
    }

    &:after{
	content: '';
	display: inline-block;
	position: absolute;
	top: 0;
	left: 15px;
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: #95572b;
	color: #95572b;
	animation: ${dotsFlashing} 1s infinite alternate;
	animation-delay: 1s;
    }
`;


export default function InfiniteScroll(props) {

    const stateRef = useRef();
    const params = queryString.parse(location.search);

    const [elements, setElements] = useState([]);
    const [progress, setProgress] = useState(false);
    const [completed, setCompleted] = useState(false);
    stateRef.current = completed;

    let scrollEventLock = false;
    let offset=0;
    
    useEffect( () => {
	getElementsAPI();
	window.addEventListener('scroll', infiniteScroll);
	return () => {
	    window.removeEventListener('scroll', infiniteScroll);
	}
    }, []);

    function infiniteScroll() {
	//If locked, if the current scroll height is high enough unlock
	if (scrollEventLock && (window.innerHeight + window.pageYOffset < (document.body.offsetHeight - 400))){
	    scrollEventLock = false;
	}
	//If unclocked, lock to avoid multiple consecutive API calls
	if (!scrollEventLock && !stateRef.current && !progress && (window.innerHeight + window.pageYOffset >= document.body.offsetHeight)) {
	    scrollEventLock = true;
	    getElementsAPI();
	}
    }

    function getElementsAPI() {
	setProgress(true);

	let allparams = {
	    props : props,
	    offset : offset,
	    params : params
	}
	
	let requestParams = props.setRequestParams(allparams)

	axios.get(route(props.APIRouteName, requestParams))
	    .then((response) => {
			console.log('Event',response.data);
		setElements(prev => [...prev, ...response.data]);
		setCompleted((response.data.length < props.elemsPerCall) ? true : false);
		setProgress(false);
	    })
	    .catch((error) => {
		console.log(error);
		setProgress(false);
		setCompleted(true);
	    });

	offset+=props.elemsPerCall;
    }


    const Elements = elements.map((element) => (
	props.elementRendering(element)
    ));



    return (
	<div>
	    { Elements }
	{ (elements.length==0 && completed ) && <div className="d-flex justify-content-center text-align-center my-5"><p style={{textAlign:"center"}}>{props.noResults}</p></div>}
	    { progress && (<div className="d-flex justify-content-center my-5"><DotsFlashing/></div>)}
	</div>
    );
}
