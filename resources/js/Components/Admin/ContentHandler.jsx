import React, { useState, useEffect } from 'react';
import TagEditDelete from "@/Components/Admin/TagEditDelete";
import { Container, Row, Card, Col, Button, Tabs, Tab } from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function ContentHandler(props) {

    const [postTags, setPostTags] = useState([])
    const [eventTags, setEventTags] = useState([])

    useEffect( () => {
	axios.get(route("api.content.tags.post"))
	    .then((response) => {
		setPostTags(response.data);
	    })
	    .catch((error) => {
		console.log(error);
	    });
	axios.get(route("api.content.tags.event"))
	    .then((response) => {
		setEventTags(response.data);
	    })
	    .catch((error) => {
		console.log(error);
	    });
    }, [])
    
    function createPostTag(e){
        e.preventDefault();
        swal({
            title: "Inserisci nuovo tag",
	    text: "Nome del nuovo tag:",
            icon: "info",
	    content: "input",
	    inputTextColor: "#000000",
            dangerMode: true,
	    buttons: ["Annulla", "Inserisci"],
          }).then((input) => {
            if(input){
                axios.post(route('api.content.post.tag', {
		    name: input,
		    type: "post" 
                })).then(function (response) {
                    if(response.status == 200){
			window.location = route("dashboard")
                    }
                })
            }
        });
    }

    function createEventTag(e){
        e.preventDefault();
        swal({
            title: "Inserisci nuovo tag",
	    text: "Nome del nuovo tag:",
            icon: "info",
	    content: "input",
	    inputTextColor: "#000000",
            dangerMode: true,
	    buttons: ["Annulla", "Inserisci"],
          }).then((input) => {
            if(input){
                axios.post(route('api.content.post.tag', {
		    name: input,
		    type: "event" 
                })).then(function (response) {
                    if(response.status == 200){
			window.location = route("dashboard")
                    }
                })
            }
        });
    }

    const postTagItems = postTags.map((element) => (
	<TagItem tags={postTags} setTags={setPostTags} tag={element}/>
    ));

    const eventTagItems = eventTags.map((element) => (
	<TagItem tags={eventTags} setTags={setEventTags} tag={element}/>
    ));

    return(
	<div>
		<h1 className="my-5 py-3" style={{textAlign:"center"}}> Gestione Tags </h1>
		<Tabs
		    defaultActiveKey="post"
		    id="justify-tab-example"
		    className="mb-3"
		    justify
		    >
		    <Tab eventKey="post" title="Tag Post">
			<div className="d-flex" style={{alignSelf : "flex-end"}}>
			    {/* edit button */}
			    <button 
				className="ms-auto my-2 btn btn-outline-success"
				onClick={createPostTag}
			    >
			    <FontAwesomeIcon icon={faPlus} />
			    </button>
			</div>
			{postTagItems}
		    </Tab>
		    <Tab eventKey="eventi" title="Tag Eventi">
			<div className="d-flex" style={{alignSelf : "flex-end"}}>
			    {/* edit button */}
			    <button 
				className="ms-auto my-2 btn btn-outline-success"
				onClick={createEventTag}
			    >
			    <FontAwesomeIcon icon={faPlus} />
			    </button>
			</div>
			{eventTagItems}
		    </Tab>
		</Tabs>
	</div>
    )
}


export function TagItem(props) {
    return(
	<Col>
	    <Card className="primary">
		{props.tag.name}
		<TagEditDelete tags={props.tags} setTags={props.setTags} tag={props.tag} />    
	    </Card>
	</Col>
    )
}
