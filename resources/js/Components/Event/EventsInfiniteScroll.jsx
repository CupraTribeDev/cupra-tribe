import React from 'react';
import InfiniteScroll from "@/Components/Utils/InfiniteScroll";
import { EventThumbnailSearch } from "@/Components/Event/EventThumbnail";
import Anchor from "@/Components/Utils/Anchor";

export default function EventsInfiniteScroll() {

    function setRequestParams(allparams){
	let requestParams = {
	    offset : allparams.offset,
	    order : 'DESC',
	    tags : ((allparams.params.eventtags === undefined) ? null : ((Array.isArray(allparams.params.eventtags) ? allparams.params.eventtags : [allparams.params.eventtags]))),
	    searchString : ((allparams.params.search === undefined) ? null : allparams.params.search),
	    eventstart : ((allparams.params.eventstart === undefined) ? null : allparams.params.eventstart),
	    eventend : ((allparams.params.eventend === undefined) ? null : allparams.params.eventend),
	    location : ((allparams.params.location === undefined) ? null : allparams.params.location)
	}
	return requestParams;
    }

    function elementRendering(element){
	return (<EventThumbnailSearch event={element}/>);
    }
    
    const noResults = <p className="text-white">La ricerca non ha prodotto alcun risultato. <Anchor routeName={'home'}>Annulla la ricerca.</Anchor></p>;

    return (
	<InfiniteScroll elemsPerCall={10} APIRouteName='api.content.get.events' setRequestParams={setRequestParams} elementRendering={elementRendering} noResults={noResults}/>
    );
}
