import React, { useState, useEffect } from "react";
import CupraTribe from '@/Layouts/CupraTribe';
import { Container, Row, Tabs, Tab } from 'react-bootstrap';
import FiltersContainer from "@/Components/FiltersContainer";
import PostsInfiniteScroll from "@/Components/Post/PostsInfiniteScroll";
import EventsInfiniteScroll from "@/Components/Event/EventsInfiniteScroll";
import UsersInfiniteScroll from "@/Components/User/UsersInfiniteScroll";
import Scrolltop from "@/Components/ScrollTop";
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';


export default function Search(props){ 
    

    const [key, setKey] = useState("posts");
    const [searchString, setSearchString] = useState("");

    function tabSelection(keyEvent){
	setKey(keyEvent);
	console.log(keyEvent);
    }

    useEffect( () => {
	setSearchString((queryString.parse(location.search).search === undefined) ? "" : queryString.parse(location.search).search);
    }, [])

    return(
        <CupraTribe user={props.auth.user} title="Homepage">
            <Container className="my-3">
                <h3 className="oxygen-white d-inline"><FontAwesomeIcon icon={faSearch}/> Risultati della Ricerca per: </h3><h3 className="p-0" style={{color:"var(--cp-cupra-copper)", display:'inline'}}>{searchString}</h3>
                <hr className="oxygen-white" />
                <Row className="d-flex" id="action-col-rev">
                    <div
                        id="main-col"
                        className="col-sm-12 col-lg-8 p-0"
                    >
                        <Tabs 
                        defaultActiveKey="posts"
                        onSelect={tabSelection}
                        className="m-3"
                        justify>
                        <Tab eventKey="posts" title="Post">
                            { key=="posts" && <PostsInfiniteScroll/> }
                        </Tab>
                        <Tab eventKey="events" title="Eventi">
                            { key=="events" && <EventsInfiniteScroll/> }
                        </Tab>
                        <Tab eventKey="users" title="Utenti">
                            { key=="users" && <UsersInfiniteScroll/> }
                        </Tab>
                        </Tabs>
                    </div>
                    <div
                        className="col-xl-4 col-sm-12"
                    >
                            <FiltersContainer/>
                        <Scrolltop/>
                    </div>
                </Row>
            </Container>
        </CupraTribe>
    );
}
