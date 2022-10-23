import React, {useEffect, useState} from "react";
import Anchor from "@/Components/Utils/Anchor";
import { Container, Row, Col, Button} from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Avatar from "@/Components/User/Avatar";
import EditDelete from "../Auth/EditDelete";
import Flair, {Flairs} from "./Flair";
import moment from "moment/min/moment-with-locales";
import CommentEditor from "./Comment/CommentEditor";
import InfoPost from "./InfoPost";
import parser from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlag, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';


export default class Post extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            //questo è l'utente che esegue la richiesta della pagina ovvero l'auth user
            user: props.user,
            post: props.post,
        }
        this.avatarSize = 32;

        this.Title = this.Title.bind(this);
        this.Content = this.Content.bind(this);
        this.editButton = this.editButton.bind(this);
        this.signalButton = this.signalButton.bind(this);
        this.actionPost = this.actionPost.bind(this);
        this.eventButton = this.eventButton.bind(this);

        moment.locale('it');
    }

    eventButton(){
        if(this.state.post != null){
            if(this.state.post.event_id != null)
                return(
                    <button 
                        onClick={() => { window.location = route('viewevent', {id:this.state.post.event_id})}} 
                        className='btn btn-outline-info'
                        title="Vai all'evento"
                    >
                        <FontAwesomeIcon icon={faCalendarCheck}/>
                    </button>
                )
            if(this.state.post.official_event_id != null)
                return(
                    <button 
                        onClick={() => { window.location = route('viewevent', {id:this.state.post.official_event_id})}} 
                        className='btn btn-outline-info'
                        title="Vai all'evento"
                    >
                        <FontAwesomeIcon icon={faCalendarCheck}/>
                    </button>
                )   
        }
        return(
            <></>
        )
    }

    editButton(){
        if(this.state.user != null){
            if(this.state.user.username == this.state.post.posted_by_username){
                return(
                    <EditDelete post={this.state.post}></EditDelete>
                )
            }
        }
        return(<></>)
    }

    signalButton(){
        if(this.state.user != null){
            if(this.state.user.username != this.state.post.posted_by_username){
                return(
                        <button 
                            className="btn btn-outline-warning mx-2"
                            title="Segnala contenuto"
                            onClick={ 
                                () => { 
                                    swal({
                                        icon: 'warning',
                                        title: 'Segnalazione',
                                        text: 'Sei sicuro di voler segnalare il post di ' + this.state.post.posted_by_username + ' agli amministratori?',
                                        dangerMode: true,
                                        buttons: {
                                            cancel : 'Annulla',
                                            confirm : {text:'Conferma', className: 'swal-confirm'},
                                        },
                                    })
                                    .then((result) => {
                                        if(result){
                                            axios.put(route('put.post.report', {id: this.state.post._id})).then((response) => {
                                                if(response.data.success){
                                                    swal({
                                                        text: 'Segnalazione inviata agli amministratori.',
                                                        icon: 'success',
                                                        autoClose: 5000,
                                                    })
                                                } else {
                                                    swal({
                                                        text: response.data.msg,
                                                        icon: 'info',
                                                        autoClose: 5000,
                                                    })

                                                }
                                            })
                                        }
                                    })
                                
                                }
                            }
                        >
                            <FontAwesomeIcon icon={faFlag} />
                        </button>
                )
            }
        }
        return(<></>)
    }

    actionPost(){
        return(
                <InfoPost 
                    post={this.state.post}
                    className='mx-4'
                >
                    <this.signalButton></this.signalButton>
                </InfoPost>
        )
    }

    Title(){
        return(
            <div
                id="post-title"
            >
                <div
                    className="d-flex align-items-center mx-4 py-2"
                >
                    <Avatar
                        user={this.state.post.posted_by_username}
                        size={this.avatarSize}
                    />
                    <Anchor 
                        routeName="viewuser"
                        routeParams={{username: this.state.post.posted_by_username}}
                        className="ms-2 post-title-user">
                        @{this.props.post.posted_by_username}
                    </Anchor>
                    <span 
                        className="ms-2 post-title-user">
                        {moment(this.state.post.created_at).fromNow()}
                    </span>
                    <this.editButton></this.editButton>
                    
                </div>
                <div
                    className="post-title-title"
                    style={{
                        paddingLeft: this.avatarSize,
                        paddingRight: this.avatarSize/2
                    }}
                >
                    { this.props.post.title }
                </div>
                <Flairs className="ms-auto px-4 p-1 pb-3" tags={this.props.post.tags} size={9}/>
            </div>
            
        );
    }

    Content(){
        return(
            <div
                className="post-content mb-5"
                style={{
                    paddingLeft: this.avatarSize,
                    paddingRight: this.avatarSize/2
                }}
            >
                <section className="post-content-text">
                    {parser(this.props.post.text)}
                </section>
                <section className="d-flex justify-content-center post-content-images">
                {Object.values(this.props.post.images).map( function(val) {
                    return (
                        <img
                            src={val} // use normal <img> attributes as props
			    style={{
				maxHeight: "70vh",
				maxWidth: "100%"
			    }}
                            className="post-content-image"
                        />
                        )})}
                </section>
            </div>

        );
    }

    render() {
        return(
        <Container
            className={ "postpage no-hover primary card mb-5" + this.props.className}
        >
            <this.Title />
            <this.Content />
            
            <InfoPost 
                    post={this.state.post}
                    className='mx-4'
            >
                <div className="ms-auto" style={{alignSelf : "flex-end"}}>
                    <this.signalButton></this.signalButton>
                    <this.eventButton/>
                </div>
            </InfoPost>
            <hr className="mx-3 my-3"/>
            <CommentEditor parentPost={this.state.post._id} user={this.state.user}/>
        </Container>
    );
    }
}
