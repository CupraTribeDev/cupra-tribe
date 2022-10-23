import React from 'react';
import Card from 'react-bootstrap/Card';
import Anchor from "@/Components/Utils/Anchor";
import {Inertia} from "@inertiajs/inertia"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Details } from './_styles';

export default function EventCard({event,style={}, className=""}) {
    
    function clickHandler(e){
        e.preventDefault();
        Inertia.get('/e/{id}', {...event._id})
    }

  return ( 
    <Anchor
      routeName='viewevent'
      routeParams={{id : event._id}}
    >
    <Card
        className={"bg-dark text-white m-5 cupra-card" + className}
        style={{
            width:"270px",
            height:"270px"
        }}
      >
        <Card.Img src= {event.images} alt="Card image" style={style} />
        <Card.ImgOverlay className='cupra-overlay' style={{ objectFit:'contain'}}>
          <Card.Title>{ event.title }</Card.Title>
          <Card.Text style={{ fontSize:'10px' }}> { event.type } </Card.Text>
          <p  style={{ fontSize:'12px' }}>
            { event.text  }
          </p>
          <Details className='card-link'>
            See more 
          </Details>
        </Card.ImgOverlay>
    </Card>
    </Anchor>
  );
}
