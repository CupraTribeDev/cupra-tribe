import React, {useEffect, useState} from "react";
import Anchor from "@/Components/Utils/Anchor";
import { Row, Col} from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { truncateText } from "@/scripts/truncatetext";
import Avatar from "@/Components/User/Avatar";
import Flair from "@/Components/Post/Flair";
import PostDetails from "@/Components/Post/PostDetails";
import moment from "moment/min/moment-with-locales";
import parser from 'html-react-parser';
import InfoPost from "./InfoPost";

export default function PostThumbnail({ post, className = ''}) {

    let image = "";
    moment.locale('it');


    post.text = truncateText(post.text, 400);
    if(post.images.length > 0 )
        image = (
	    <Row>
	    <LazyLoadImage
                    className="cupra-post-img ms-auto"
                    src={post.images[0]}
		    style={{
			marginTop: 10,
			maxHeight: 300,
			objectFit: 'contain',
		    }}
                />
	    </Row>
	);

    const posterInfo = (
	<div>
	    {moment(post.created_at).fromNow()} da <Anchor routeName='viewuser' routeParams={{username: post.posted_by_username}} > { post.posted_by_username } </Anchor>
	</div>
    );

    function searchTag(e){
        e.preventDefault();
        e.target.disabled = true;
	
	axios.get(route("api.content.tag.id", {name : e.target.outerText}))
	    .then((response) => {
		console.log(response.data)
		window.location = route("home", {tags : response.data})
	    })
	    .catch((error) => {
		console.log(error);
	    });
    }

    return(
    <div 
        key={"thumb-of-" + post._id}
        className="card primary post thumbnail my-2"
    >
        <PostDetails post={post}/>
	   <Anchor
                routeName="viewpost"
                routeParams={{id: post._id}}
            >
                <div className="card-body" >
                <Row>
                    <div className="card-title">
                        <Row>
			    <Avatar
				miniMode={true}
				user={post.posted_by_username}
				size={30}
				info={posterInfo}
				infoClassName="text-muted"
				className="pb-3"
			    />
                                <h5
                                    style={{ marginBottom: '1px'}}
                                >
                                    { post.title }
                                </h5>
                                <h6 
                                    className="card-subtitle me-3 text-muted"
                                    style={{
                                        display: 'inline'
                                    }}
                                >
                                </h6>
                        </Row>
                        {image}
                    </div>
                <div className="d-flex">
                    <p
			            className="card-text pe-5"
			            style={{
				            color: "linear-gradient(var(--cp-primary-fg), var(--cp-engine-gray))",
                            wordWrap: 'anywhere',
			            }}
			>
			    { parser(post.text) }
			</p>
                </div>
                </Row>
                <InfoPost post={post}>
                    <div className="ms-auto">
                        {Object.values(post.tags).map((val) => {
			    return <a onClick={searchTag}><Flair tag={val} /></a>
                        })}
                    </div>
                </InfoPost>
          </div>
	</Anchor>
    </div>
    );
}
