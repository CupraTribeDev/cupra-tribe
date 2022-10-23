import React, {useState, useEffect, useRef} from "react";
/* other import */
import {Container, Row} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEdit, faThumbtack, faUsers, faLocationDot, faUserPlus, faTag, faClock, faCalendarXmark, faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import parser from 'html-react-parser';
/* our components */
import CupraTribe from '@/Layouts/CupraTribe';
import Avatar from '@/Components/User/Avatar';
import PostThumbnail from "@/Components/Post/PostThumbnail";
import InfiniteScroll from "@/Components/Utils/InfiniteScroll";
import UserCard from "@/Components/User/UserCard";
import Swal from "sweetalert2";
import {property} from "lodash";

// [x] all'utente che ha creato il post non deve avere la possibilità di annullare l'iscrizione ma gli deve comparire il tasto annulla evento
// [x] creare il componte user card, ricordando di modificare il colore del bordino in bianco 
// [x] rimuovere il calendario e mettere solo la data nella descrizione

function EventInfo({element}){
    return(
        <p style={{display:'inline', color:'var(--engine-grey)'}}>
            <FontAwesomeIcon className='mx-1' style={{width:'14px'}} icon={element.icon}/>{ element.name + ':' } 
            <p style={{display:'inline', color:'white'}}> {element.value} </p><br/>
        </p>
    )
}

function Posts({event}){
    
    const noResults = <p className="text-white">Nessun post menziona l'evento.</p>;

    function setRequestParams(){
        let requestParams = {
            id: event,
        }
        return requestParams;
    }
    
    function elementRendering(elem){
        return(
            <PostThumbnail post={elem}/>
        )
    }
    /* infint scroll for the related event */
    return(
        <>
            <h5>Post Correlati all'evento</h5> 
            <hr />
            <InfiniteScroll
                elemsPerCall={10}
                APIRouteName='api.content.event.posts'
                setRequestParams={setRequestParams}
                elementRendering={elementRendering} 
                noResults={noResults}
            />
        </> 
    )
}

function Edit({event, user = null}){

    function editEvent(e){
        e.preventDefault();
        window.location = route('edit.event', {id: event._id});
    }
    if(user == null){
        return(<></>)
    }
    if(event.user == user._id){
        return(
            <button 
                className="m-1 btn btn-outline-secondary"
                onClick={editEvent}
            >
                <FontAwesomeIcon icon={faEdit} />
            </button>
        )
    } 

    return(
        <></>
    )

}

function Pin({event, user = null}){
    function pinEvent(e){
	e.preventDefault

	axios.put(route("get.event.promote", {id: event._id}));
    }

    if(user!=null && user.role === "admin"){
	let pinned = "";

	if(event.ispromoted)
	    pinned="rotate-180";

        return(
            <button 
                className={"m-1 btn btn-outline-secondary " + pinned}
		onClick={pinEvent}
            >
                <FontAwesomeIcon icon={faThumbtack} />
            </button>
        )
    }
    return(<></>);
}

export default function Event(props){ 
    

    const [apiToken, setToken] = useState(false);
    const [partecipant, setPartecipant] = useState(props.event.partecipation.length);
    const [ispartecipant, SetIsParteciapant] = useState( () => {
        if(props.auth.user != null){
            return props.event.partecipation.includes(props.auth.user.username)
        } else {
            return false
        }
    });
    const [date, setDate] = useState(null);
    const [users, setUsers] = useState(props.event.partecipation);

    const onDateChange = (newDate) => {
        setDate(newDate);
        console.log(newDate);
    }


    const info = [
        { name:'Organizzatore', value: props.user.first_name + " " + props.user.last_name,  icon: faUser },
        { name:'Tipologia',     value: props.event.type,                                    icon: faTag },
        { name:'Partecipanti',  value: props.event.partecipation.length,                    icon: faUsers },
        { name:'Luogo',         value: props.event.place,                                   icon: faLocationDot },
        { name:'Orario',        value: props.event.time,                                    icon: faClock },
        { name:'Data',          value: props.event.from_date,                               icon: faCalendarDay },
    ]

    /*
    ######################################################################
    # Partecipation Event
    ######################################################################
    */
    async function getApi() {
    }

    async function addPartecipation(e){
        e.preventDefault();
        axios.put(route('api.content.event.add.partecipant', {
            id: props.event._id,
        })).then((response) =>{
            if(response.data.success === true){
                swal({
                    title:'Partecipazioni',
                    text: 'Sei stato aggiunto alla lista dei partecipanti.',
                    icon: 'success',
                    buttons: {
                        confirm : {text:'Ok', className: 'swal-confirm'},
                    },
                })
                setPartecipant(partecipant + 1);
                SetIsParteciapant(true);
            }
            if(response.data.success === false){
                swal({
                    title: 'Errore',
                    text: 'si è verificato un errore, riprova.',
                    icon: 'error'                    
                })
            }
        })
    }

    async function removePartecipation(e){
        e.preventDefault();
        axios.put(route('api.content.event.remove.partecipant', {id: props.event._id}))
        .then((response) => {
            if(response.data.success == true){
                SetIsParteciapant(false);
                setPartecipant(partecipant - 1);
                swal({
                    title:'Partecipazioni',
                    text: 'Sei stato rimosso alla lista dei partecipanti.',
                    icon: 'success',
                    buttons: {
                        confirm : {text:'Ok', className: 'swal-confirm'},
                    },
                })

            }
        })
    }

    function handleCancelEvent(e){
        e.preventDefault();
        new Swal({
            title: 'Annulla Evento',
            icon: 'warning',
            text: 'Sei sicuro di voler cancellare l\'evento',
            dangerMode: true,
            dangerMode: true,
            buttons: {
                cancel : 'Annulla',
                confirm : {text:'Conferma', className: 'swal-confirm-danger'},
            },

        }).then((flag) => {
            if(flag){
                axios.put(route('cancel.event', {id:props.event._id})).then(()=>{
                window.location = route('home')
            })
        }
        })
    }

    // conditional rendering of button for partecipation/unpartecipation
    function Partecipation(){
        if(props.auth.user == null){
            return(
                <button 
                    className="btn btn-outline-success"
                    onClick={() => {window.location = route('register')}} >
                    Registrati
                </button>
            )
        }
        // the current date must be before the date of the event to cancel
        if(props.event.iscanceled)
            return 'Evento cancellato';
        if(new Date() < new Date(props.event.from_date)){
             // if the user is the owner he can cancel the event
            if(props.auth.user._id == props.event.user){
                return(
                    <button
                        className="btn btn-outline-danger m-2" 
                        onClick={handleCancelEvent}
                    >
                        <FontAwesomeIcon icon={faCalendarXmark}/>
                        &nbsp; Annulla l'evento
                    </button>
                )
            }
            // if the user is a partecipant he can unsuscribe
            if(ispartecipant){
                return(
                    <button 
                        onClick={removePartecipation}  
                        className="btn btn-outline-danger m-2" 
                        style={{borderRadius:'50px'}}
                    >  
                        <FontAwesomeIcon className='mx-1' style={{width:'14px'}} icon={faUserPlus}/>
                        &nbsp; Annulla
                    </button>
                )
            }
            // if the user is not a partecipant he can suscribe
            return(
                <button 
                    onClick={addPartecipation}  
                    className="btn btn-outline-success m-2" 
                    style={{borderRadius:'50px'}}
                >  
                    <FontAwesomeIcon className='mx-1' style={{width:'14px'}} icon={faUserPlus}/>
                    &nbsp; Partecipa
                </button>
            )

        }
        return (
            'Evento terminato'
        )
    }

    /*
    ######################################################################
    # Renderting of the components
    ######################################################################
    */
    return(
        <CupraTribe user={props.auth.user} title="Homepage">
            <Container className="my-3">
                <Row>
                    {/* Core of the event */}
                    <div className="col-lg-9 col-xs-12 primary no-effect no-hover">
                        <Row 
                             style={{ 
                                backgroundImage: `url(${props.event.images})`, 
                                backgroundSize: 'cover', 
                                backgroundRepeat:"no-repeat", 
                                height:'250px'
                            }}
                            className="border" 
                        >
                            <div className="cupra-overlay p-0">
                                <Row className="p-4 mx-1 d-flex justify-content-center">
                                    <div className="col-1 p-2">
                                        <Avatar user={props.user.username}/>
                                    </div>
                                    <div className="col-4 px-0 my-auto">
                                        <div className="mt-4"  style={{display:'inline'}}>
                                            <p 
                                                style={{
                                                    display:'inline', 
                                                    color:'var(--engine-grey)'
                                                }}
                                            >
                                                <FontAwesomeIcon className='mx-1' style={{width:'14px'}} icon={faUser}/>
                                                @{props.user.username}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-auto ms-auto my-auto" style={{alignSelf : "flex-end"}}>
                                        <Edit user={props.auth.user} event={props.event}/>
					                    <Pin  user={props.auth.user} event={props.event}/>
                                    </div>
                                </Row>
                                <h2 className="p-4 m-3 oxygen-white">{props.event.title}</h2>
                            </div>
                        </Row> 
                        <Row 
                            style={{ border:'1px solid var(--cp-oxygen-white)' }}
                            className='px-4' 
                        >

                            <div 
                            >
                                <div className="row">
                                    <div className="col-6 my-4">
                                        {info.slice(0,3).map((elem) => (<EventInfo element={elem}/>))}
                                    </div>
                                    <div className="col-6 my-4">
                                        {info.slice(3,6).map((elem) => (<EventInfo element={elem}/>))}
                                    </div>
                                </div>
                                {/* Description of the event */}
                                <h5 
                                    style={{color:'var(--engine-grey)'}}
                                    className="mb-2" 
                                >
                                    Descrizione evento
                                </h5>
                                <hr/>
                                {parser(props.event.description)}
                                {/* post of the event */}
                                <div className="my-4">
                                    <PostThumbnail post={props.post}/>
                                </div>
                            </div>
                        </Row>
                    </div>
                    {/* Partecipation */}
                    <div className="col-lg-3 col-xs-12">
                        <div>
                            <div 
                                className="p-3 oxygen-white primary no-effect no-hover"
                                style={{ border:'1px solid var(--cp-oxygen-white)' }}
                            >
                                <h5
                                    className="mt-3"
                                    style={{textAlign:'center', color:'var(--engine-grey)'}}
                                >
                                    Elenco Partecipanti
                                </h5>
                                <hr />
                                {/* User Cards */}
                                <div 
                                    className="m-auto d-flex align-items-center" 
                                    style={{
                                        overflow:'scroll', 
                                        minHeight:'200px', 
                                        maxHeight:'325px', 
                                        flexDirection:'column', 
                                        flexWrap: 'wrap'
                                    }}
                                >
                                    {users.map((user) => (<UserCard username={user}/>))}
                                </div>
                                <div 
                                    style={{
                                        flexDirection:'column',
                                        height:'88px'
                                    }}
                                    className="m-auto d-flex align-items-center justify-content-center"
                                >
                                    <br/>
                                    <Partecipation/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
            <Container className="my-4 px-5">
                <div className="row">
                    <div className="col-9">
                        <Posts event={props.event._id}/>
                    </div>
                </div>
            </Container>
        </CupraTribe>
    );
}
