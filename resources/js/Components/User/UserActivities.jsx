import React from 'react';
import InfiniteScroll from "@/Components/Utils/InfiniteScroll";
import PostThumbnail from "@/Components/Post/PostThumbnail";

export default function UserActivities(props) {

    function setRequestParams(allparams){
	let requestParams = {
		user_id: allparams.props.user._id,
		// Username del proprietario dei post
		username: allparams.props.user.username,
		offset : allparams.offset,
		numElements: allparams.props.elemsPerCall
	}
	return requestParams;
    }

    function elementRendering(element){
	return (<PostThumbnail post={element}/>);
    }

    const noResults = <p className="text-white">Nessuna attività relativa a {props.user.username}.</p>;

    return (
	<InfiniteScroll user={props.user} elemsPerCall={5} APIRouteName="api.user.get.activities" setRequestParams={setRequestParams} elementRendering={elementRendering} noResults={noResults}/>
    );
}
