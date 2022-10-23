// import React, { useState, useEffect, useRef } from 'react';
// import InfiniteScroll from "@/Components/Utils/InfiniteScroll";
// import EventCard from "@/Components/Event/EventCard";

// export default function UserEvents(props) {

//     function setRequestParams(allparams){
// 	let requestParams = {
//             userId: allparams.props.id,
//             // Indica se vogliamo gli eventi di cui l'utente è proprietario
//             isOwner: allparams.props.owner,
//             offset : allparams.offset,
//             numElements: allparams.props.elemsPerCall
// 	}
// 	return requestParams;
//     }

//     function elementRendering(element){
// 	return (<EventCard post={element}/>);
//     }

//     const noResults = <p className="text-white">{props.username} non ha creato eventi.</p>;

//     return (
// 	<InfiniteScroll id={props.id} owner={props.owner} elemsPerCall={5} APIRouteName="api.content.events.get.userevents" setRequestParams={setRequestParams} elementRendering={elementRendering} noResults={noResults}/>
//     );
// }



import React, { useState, useEffect } from 'react';
 import axios from "axios";
 import EventCard from './EventCard';
 import styled, { keyframes } from "styled-components";

 const rotate = keyframes`
   to {
     transform: rotate(360deg);
   }
 `;

 const SpinningDiv = styled.div`
     animation: 1.5s ${rotate} linear infinite;
 `;

 const dotsFlashing = keyframes`
   0% {
     background-color: #95572b;
   }
   50%,
   100% {
     background-color: #d9cebd;
   }
 `;

 const DotsFlashing = styled.div`
     position: relative;
     width: 10px;
     height: 10px;
     border-radius: 5px;
     background-color: #95572b;
     color: #95572b;
     animation: ${dotsFlashing} 1s infinite linear alternate;
     animation-delay: .5s;

     &:before{
 	content: '';
 	display: inline-block;
 	position: absolute;
 	top: 0;
 	left: -15px;
 	width: 10px;
 	height: 10px;
 	border-radius: 5px;
 	background-color: #95572b;
 	color: #95572b;
 	animation: ${dotsFlashing} 1s infinite alternate;
 	animation-delay: 0s;
     }

     &:after{
 	content: '';
 	display: inline-block;
 	position: absolute;
 	top: 0;
 	left: 15px;
 	width: 10px;
 	height: 10px;
 	border-radius: 5px;
 	background-color: #95572b;
 	color: #95572b;
 	animation: ${dotsFlashing} 1s infinite alternate;
 	animation-delay: 1s;
     }
 `;

 export default function UserEvents({id, owner}){

     const [events, setEvents] = useState([]);
 	// Indica se stiamo caricando dei dati attraverso chiamata api (axios)
     const [loading, setLoading] = useState(true);
 	// Indica se ci sono altri eventi da caricare o sono finiti
     const [hasMore, setHasMore] = useState(true);
 	// Indica la row di partenza per effttuare la query
     let offset= 0;
     // Indica il numero di elementi che deve restituire la query a partire dall'offset
     let numElements= 5;

     const loadMoreEvents = () => {
 		//*************** axios call
         setLoading(true);
 		// Set di parametri da passare all'api
         let requestParams = {
             // id del proprietario dell'evento
             userId: id,
             // Indica se vogliamo gli eventi di cui l'utente è proprietario
             isOwner: owner,
             offset : offset,
             numElements: numElements
         }

         axios.get(route("api.content.events.get.userevents", requestParams))
             .then((response) => {
                 const newEvents = [];
 				response.data.forEach((event) => newEvents.push(event));
 				setEvents(oldEvents => [... oldEvents, ...newEvents]);
 				setHasMore(response.data.length==0 ? false : true)
                // console.log('Events', response.data);
             })
             .catch((error) => {
                 console.error(error.response.data);
             });

         offset= offset+numElements;
         setLoading(false);
 		//***************
     };

 	// Carichiamo nuovi eventi con loadMoreEvents quando arriviamo a fine pagina
     const handleScroll = (e) => {
 		if(window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight){
 			loadMoreEvents();
 		}
 	}

     // Prima di reinderizzare il componente carichiamo degli eventi con loadMoreEvents e osserviamo l'evento di scrolling
     useEffect(() => {
 		loadMoreEvents();
 		window.addEventListener('scroll', handleScroll)
 	}, [])

 	const Events = events.map((event) => (
 		<EventCard event={event}/>
 		));

     // Se non stiamo effettuando nessuna richiesta axios, non è stato caricato nessun evento 
 	// e non ci sono altri eventi da caricare restituiamo "Nessun risultato."
     if(!hasMore && !events.length && !loading){
         return (
             <div>
                 <p>Nessun risultato.</p>
             </div>
         );
     }

 	// Se abbiamo degli eventi li visualizziamo e se ce ne sono altri da caricare mostriamo l'animazione di loading
     return (
 	<div className="justify-content-center">
 	    {Events}
 		{hasMore && <div className="d-flex justify-content-center my-5"><DotsFlashing/></div>}
 	</div>
     );

 }
