import React from 'react';
import InfiniteScroll from "@/Components/Utils/InfiniteScroll";
import { UserThumbnail } from "@/Components/User/UserCard";
import Anchor from "@/Components/Utils/Anchor";

export default function PostsInfiniteScroll() {

    function setRequestParams(allparams){
	let requestParams = {
	    offset : allparams.offset,
	    searchString : ((allparams.params.search === undefined) ? null : allparams.params.search)
	}
	return requestParams;
    }

    function elementRendering(element){
	return (<UserThumbnail username={element.username}/>);
    }
    
    const noResults = <p className="text-white">La ricerca non ha prodotto alcun risultato. <Anchor routeName={'home'}>Annulla la ricerca.</Anchor></p>;

    return (
	<InfiniteScroll elemsPerCall={10} APIRouteName='api.content.get.users' setRequestParams={setRequestParams} elementRendering={elementRendering} noResults={noResults}/>
    );
}
