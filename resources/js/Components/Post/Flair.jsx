import React from "react";
import styled from "styled-components";

export default function Flair({tag, size=12}){
    
    return(
        <div
            key={tag.toString()}
            className="me-1 flair"
            style={{
                fontSize: size,
            }}
        >
            {tag}
        </div>
    );
}

export function SelectedFlair({tag}){
    return(
        <div
            key={tag.toString()}
            className="me-1 flair selected">
            {tag} <div className="vr border border-secondary"/> X
        </div>
    );
}

export function Flairs({tags, size=12, className=""}){
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

    let flairs = Object.values(tags).map( function(val) {
	return( <a onClick={searchTag}><Flair tag={val} size={size}/></a>);
    });
    return(
        <div className={"" + className}>
            {flairs}
        </div>
    );
}
