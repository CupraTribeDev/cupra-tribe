import React from 'react';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
import Card from 'react-bootstrap/Card';
import { Col, Row } from "react-bootstrap";
import { Details } from './_styles';
import Anchor from '@/Components/Utils/Anchor';
import EventCard from './EventCard';
import moment from "moment/min/moment-with-locales";

import cupralogo from '../../../img/app/logo/cupra-bianco.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export function EventThumbnail({event}){

    let icon;
    if(event.isofficial){
        icon = <img src={cupralogo} style={{width:'25px', marginBottom:'4px'}}alt='Cupra-Logo'/>
    } else {
        icon = <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>
    }
    
    return(
	<Anchor
	    key={event._id}
	    routeName="viewevent" 
	    routeParams={{id: event._id}}
	    className="card"
	    style={{
		border: 'none',
		cursor: 'pointer',
		background: 'none',
		maxHeight: '100px',
		width: '100%',
		maxWidth: '100%',
	    }}
	>
	    <Card
		className="my-2 event-thumbnail text-white align-self-center"
		style={{
		    width: "87%",
		    height: '90px',
		    maxHeight: '100px',
		    objectFit: 'cover',
		}}
	    >
		<LazyLoadComponent>
		    <Card.Img 
			src= {event.images}
			alt="Card image"
			style={{overflow:'hidden'}}
		    />
		</LazyLoadComponent>
		<Card.ImgOverlay
		    className='cupra-overlay'
		>
		{/*Card icon - official or community*/}
		    {icon}
		{/*Card Title*/}
		    <Card.Title
			style={{
			    display:'inline',
			    marginLeft:'15px'
			}}
		    >
			{ event.title }
		    </Card.Title>
		{/*Card Text*/}
		    <Card.Text
			style={{
			    fontSize:'10px'
			}}
		    >
			{ event.type }
		    </Card.Text>
		    <p  style={{ fontSize:'12px' }}>
			{ event.text  }
		    </p>
		    <Details className='card-link'>
			Mostra Altro	
		    </Details>
		</Card.ImgOverlay>
	    </Card>
	</Anchor>
    );

}


export function EventThumbnailSearch({event}){

    let icon;
    if(event.isofficial){
        icon = <img src={cupralogo} style={{width:'30px', marginBottom:'4px'}} alt='Cupra-Logo'/>
    } else {
        icon = <FontAwesomeIcon icon={faUsers}></FontAwesomeIcon>
    }
    
    return(
	<Anchor
	    key={event._id}
	    routeName="viewevent" 
	    routeParams={{id: event._id}}
	    className="card"
	    style={{
		border: 'none',
		cursor: 'pointer',
		background: 'none',
		maxHeight: '100px',
		width: '100%',
		maxWidth: '100%',
	    }}
	>
	    <Card
		className="my-2 text-white align-self-center"
		style={{
		    width: "87%",
		    height: '90px',
		    maxHeight: '100px',
		    objectFit: 'cover',
		}}
	    >
		<Card.Img 
		    src= {event.images}
		    alt="Card image"
		    style={{overflow:'hidden'}}
		/>
		<Card.ImgOverlay className='cupra-overlay' >
		  	{icon}
		  	<Card.Title style={{display:'inline', marginLeft:'15px'}}>{ event.title }</Card.Title>
			<Card.Text className='d-flex' style={{ fontSize:'14px' }}> { event.type }
				<p className='d-inline ms-auto align-self-end' style={{fontSize:'12px'}}> { moment(event.from_date).format("DD/MM/yyyy")}</p>
			</Card.Text>
		  	<Details className='card-link'>
		  	</Details>
		</Card.ImgOverlay>
	    </Card>
	</Anchor>
    );

}
