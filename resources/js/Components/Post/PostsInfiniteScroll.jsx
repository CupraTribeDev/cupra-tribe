import React from 'react';
import InfiniteScroll from "@/Components/Utils/InfiniteScroll";
import PostThumbnail from "@/Components/Post/PostThumbnail";
import Anchor from "@/Components/Utils/Anchor";

export default function PostsInfiniteScroll() {

    function setRequestParams(allparams){
	let requestParams = {
	    offset : allparams.offset,
	    order : 'DESC',
	    tags : ((allparams.params.tags === undefined) ? null : ((Array.isArray(allparams.params.tags) ? allparams.params.tags : [allparams.params.tags]))),
	    searchString: ((allparams.params.search === undefined) ? null : allparams.params.search),
	    poststart : ((allparams.params.poststart === undefined) ? null : allparams.params.poststart),
	    postend : ((allparams.params.postend === undefined) ? null : allparams.params.postend),
	}
	return requestParams;
    }

    function elementRendering(element){
	return (<PostThumbnail post={element}/>);
    }
    
    const noResults = <p className="text-white">La ricerca non ha prodotto alcun risultato. <Anchor routeName={'home'}>Annulla la ricerca.</Anchor></p>;

    return (
	<InfiniteScroll elemsPerCall={10} APIRouteName='api.content.get.posts' setRequestParams={setRequestParams} elementRendering={elementRendering} noResults={noResults}/>
    );
}
