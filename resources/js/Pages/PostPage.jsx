import React  from "react";
import { Row, Container } from 'react-bootstrap';

import EventCarousel from "@/Components/Carousel";
import CommentSection from "@/Components/Post/Comment/CommentSection";
import CupraCalendar from "@/Components/Event/Calendar";
import CupraTribe from '@/Layouts/CupraTribe';
import Post from "@/Components/Post/Post";
import { ToastContainer, toast } from 'react-toastify';

export default function PostPage(props){

    return(
        <CupraTribe user={props.auth.user} title="Post">
            <Container className="my-3">
                    <Row className="col" >
                        <div 
                            id="main-col"
                            className="col-sm-8"
                        >
                            <Post
                                post={props.post}
                                user={props.auth.user}
                            />
                            <CommentSection
                                user={props.auth.user}
                                comments={props.comments}
                            /> 
                        </div>
                        <div 
                            id="action-col"
                            className="col-sm-4"
                        >
                            <EventCarousel />
                            <CupraCalendar />
                        </div>
                    </Row>
                    <ToastContainer />
            </Container>
        </CupraTribe>
    );
}
