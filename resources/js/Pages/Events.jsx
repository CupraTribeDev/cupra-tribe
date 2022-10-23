import React, {useEffect, useState} from "react";
import CupraTribe from '@/Layouts/CupraTribe';
import Container from 'react-bootstrap/Container';
import CardGroup from 'react-bootstrap/CardGroup';
import EventCard from "@/Components/Event/EventCard";
import Slider from "react-slick";



export default function Events(props){ 

    //TODO: aggiornamento dimanico del numero di slide da mostrare
    const [settings, setSettings] = useState(
        {
            infinite: true,
            speed: 500,
            slidesToShow: Math.trunc(((window.innerWidth/300))),
            slidesToScroll: 1
        }
    );


    return(
        <CupraTribe user={props.auth.user} title="Homepage">
            <Container className="my-3">
                    <div className="col-sm-8 p-0">
                    <CardGroup>
                        <Slider {...settings} style={{ height:'300px', width:'80vw' }}>
                            {Object.values(props.events).map((event) =>{
                                return(<EventCard event={event}/>);
                                    }
                                )
                            }
                        </Slider>
                    </CardGroup>
                    <CardGroup>
                        <Slider {...settings} style={{ height:'300px', width:'80vw' }}>
                            {Object.values(props.events).map((event) =>{
                                return(<EventCard event={event}/>);
                                    }
                                )
                            }
                        </Slider>
                    </CardGroup>
                    </div>
            </Container>
        </CupraTribe>
    );
}