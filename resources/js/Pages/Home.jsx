import React from "react";
import CupraTribe from '@/Layouts/CupraTribe';
import { Container, Row} from 'react-bootstrap';
import EventCarousel from "@/Components/Carousel";
import Calendar from "@/Components/Event/Calendar";
import TagContainer from "@/Components/TagContainer";
import PostsInfiniteScroll from "@/Components/Post/PostsInfiniteScroll";
import Scrolltop from "@/Components/ScrollTop";


export default function Home(props){ 
    return(
        <CupraTribe user={props.auth.user} title="Homepage">
            <Container className="my-3">
                    <Row>
                        <div
                            id="main-col"
                            className="col-sm-8 p-0">
			    <PostsInfiniteScroll/>
                        </div>
                        <div
                            id="action-col"
                            className="col-sm-4">
                            <EventCarousel style={{ height: '300px' }}></EventCarousel>
                            <Calendar />
			    <TagContainer tagType="post"/>
                            <Scrolltop/>
                        </div>
                    </Row>
            </Container>
        </CupraTribe>
    );
}
