import React, {Children, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faComment} from "@fortawesome/free-solid-svg-icons";

export default function InfoPost({ post, children , className = ''}){
    
    const [likes, setLikes] = useState(post.likes);
    const [liked, setLiked] = useState(false);

    async function clickHandler(e){
        e.preventDefault();
	    axios.post(route('api.content.post.like', {
	        id: post._id,
	        islike: true
	    })).then((response) =>{
	        if(response.data.success === true){
		    setLikes(likes + 1);
	        }
	        else if(response.data.success === false){
		        setLikes(likes - 1);
	        }
	    })
    }

    return(
        <div className={"d-flex align-items-center " + className}>
            <div className="mt-3 post-stats d-flex align-items-center">
                <FontAwesomeIcon
                    icon={faArrowUp}
                    onClick={clickHandler}
                /> {likes}
                <FontAwesomeIcon
                    className="ps-3"
                    icon={faComment}
                /> {post.comments}
            </div>
            {children}
        </div>
    )

}