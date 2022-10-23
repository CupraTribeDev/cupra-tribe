import React, { useState, useEffect } from 'react';
import { Container, Row, Col} from "react-bootstrap";
import queryString from 'query-string';
import Flair, {SelectedFlair} from "@/Components/Post/Flair";

export default function TagContainer(props) {
    
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    let selectedTagsIds = NaN
    let queryParamName = NaN
    let params = queryString.parse(location.search);
    if(props.tagType == "post"){
	queryParamName = "tags";
	selectedTagsIds = ((params.tags === undefined) ? [] : ((Array.isArray(params.tags) ? params.tags : [params.tags])));
    }else if(props.tagType == "event"){
	queryParamName = "eventtags";
	selectedTagsIds = ((params.eventtags === undefined) ? [] : ((Array.isArray(params.eventtags) ? params.tags : [params.eventtags])));
    }
    let searchParams = new URLSearchParams(window.location.search);

    useEffect( () => {
	let isMounted = true;
	if (isMounted) {
	    let reqParams = {
		tagtype : props.tagType,
	    }
	    axios.get(route("api.content.tags", reqParams))
		.then((response) => {
		    setSelectedTags( response.data.filter(function(tag){ return selectedTagsIds.includes(tag._id)}));
		    setTags( response.data.filter(function(tag){ return !selectedTagsIds.includes(tag._id)}));
		})
		.catch((error) => {
		    console.log(error);
		});
	}
	return () => {isMounted = false};
    }, [])

    function addUrlTagParameter(tagId){
	searchParams.append(queryParamName, tagId);
	window.location.search = searchParams.toString();
    }

    function deleteUrlTagParameter(tagId){
	//Didn't find a function to delete just one of the tags paramaters
	searchParams.delete(queryParamName);
	selectedTagsIds = selectedTagsIds.filter(function(element){ return element != tagId});
	selectedTagsIds.forEach((tagId) => {
	    searchParams.append(queryParamName, tagId);
	});
	window.location.search = searchParams.toString();
    }

    return (
	<Container
            id="tag-container"
            className={ "no-hover primary card my-2 " + props.className } style={{position:'sticky', borderRadius:'0px', top:'80px'}}>
	<Row style={{textAlign:"center"}}>
	    <h4 className='text-white pt-3 m-0'>{ props.tagType=="post" && "Tag Post"}{ props.tagType=="event" && "Tag Eventi"}</h4>
	</Row>
	<Row className="m-2" style={{textAlign:"center"}}>
	{
	    Object.values(selectedTags).map((tag)=>{
		return (<span className="p-0 m-1" key={tag.name} style={{width:"max-content"}} onClick={() => deleteUrlTagParameter(tag._id)}><SelectedFlair className="m-0" tag={tag.name} /></span>);
	    })
	}
	</Row>
	<hr style={{marginTop:'0px'}}/>
	<Row className="m-2 pb-3 " style={{textAlign:"center"}}>
	    {Object.values(tags).map((tag)=>{
		return (<span className="p-0 m-1" key={tag.name} style={{width:"max-content"}} onClick={() => addUrlTagParameter(tag._id)}><Flair className="m-0" tag={tag.name} /></span>);
	    })}
	</Row>
	</Container>
    );
}
