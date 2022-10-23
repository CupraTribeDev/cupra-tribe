import React from "react";
import {Carousel} from "react-bootstrap";
import Anchor from "./Utils/Anchor";

export default class EventCarousel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoaded: false,
        };
        this.Items = [];
    }

    updateEventComponents = (events) =>{
        // for every event, add an item to the carousel
        if(events.count > 0){
            Object.values(events.events).map(event => {
                try{
                    this.Items.push(
                        <Carousel.Item
                            key={event.title}
                        >
			    <Anchor
				routeName="viewevent" 
				routeParams={{id: event._id}}
			    >
				<img
				    src={event.images[0]}
				    className="event-carousel-img"
				    alt={event.description}
				    style={{
					height: 400
				    }}
				/>
                            <Carousel.Caption>
                                <h3>{event.title}</h3> 
                                <p>{event.type}</p> 
                            </Carousel.Caption>
			    </Anchor>
                        </Carousel.Item>
                    );
                }catch(error){
                    console.error("an event can't be loaded:" + error );
                }
            });
        }
    }

    componentDidMount(){
        axios.get(route('get.event.promoted'))
            .then(
                (result) => {
                    this.updateEventComponents(result.data);
                    this.setState({
                        isLoaded: true,
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error 
                    });
                }
            )
    }

    render() {
        return(
            <Carousel
                controls={false}
                id="event-carousel"
                className="event-carousel"
                style={{
                    background:"rgba(0,0,0,0.35)",
                }}
            >
            {Object.values(this.Items).map(item => { return item; })}
            </Carousel>
        );
    }
}
