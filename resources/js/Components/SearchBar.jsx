import React, { useEffect } from 'react';
import queryString from 'query-string';

export default function SearchBar() {

    useEffect( () => {
	let value = (queryString.parse(location.search).search === undefined) ? "" : queryString.parse(location.search).search;
	$("#search").val(value)
    }, [])

    return (
	<div>
	    <form action="/search" method="get">
		<input
		    type="text"
		    id="search"
		    placeholder="Cerca nella Tribe"
		    name="search" 
		/>
	    </form>
	</div>
    );
}
