import React from 'react';
import InfiniteScroll from "@/Components/Utils/InfiniteScroll";
import PostThumbnail from "@/Components/Post/PostThumbnail";

export default function UserPostsInfiniteScroll(props) {

    function setRequestParams(allparams){
	let requestParams = {
		username: allparams.props.user,
		offset : allparams.offset,
		numElements: allparams.props.elemsPerCall
	}
	return requestParams;
    }

    function elementRendering(element){
	return (<PostThumbnail post={element}/>);
    }

    const noResults = <p className="text-white">{props.user} non ha pubblicato post.</p>;

    return (
	<InfiniteScroll user={props.user} elemsPerCall={5} APIRouteName="api.content.get.userposts" setRequestParams={setRequestParams} elementRendering={elementRendering} noResults={noResults}/>
    );
}
