import React from "react";
/* our component */
import CupraTribe from '@/Layouts/CupraTribe';
import Avatar from "@/Components/User/Avatar";
/* import for bootstrap*/
import { Row, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faComment, faPooStorm, faExclamationCircle, faEnvelope } from '@fortawesome/free-solid-svg-icons';
/* import for the form*/
import PostCreation from '@/Forms/PostCreation';

export default function NewPost(props){ 
    return(
        <CupraTribe user={props.auth.user} title="Homepage">
            <Container>
                <Row className="d-flex">
                    <h1 className="oxygen-white m-2 px-3"><FontAwesomeIcon icon={faEnvelope} /> Crea un Post</h1>
                    <hr className="oxygen-white" />
                </Row>
            </Container>
            <Container className="my-3">
                <Row className="m-3" style={{borderRadius: '0px'}}>
                    {/* Form for the post creation */}
                    <div className="col-sm-9 p-0 primary no-effect no-hover">
                        {/* Info user */}
                        <Row className="mx-4 mt-3 py-3">
                            <div className="col-1 mx-2 px-4">
                                <Avatar user={props.auth.user.username}/>
                            </div>
                            <div className="col-8 p-2 my-auto">
                                <div className="mt-4"  style={{display:'inline'}}><p style={{display:'inline', color:'var(--engine-grey)'}}>Creatore del post: <b>&#xf007; {props.auth.user.username}</b></p></div>
                                <div  style={{ color:'var(--engine-grey)'}} >Cupra Points: <b><FontAwesomeIcon icon={faCoins}/> 1234</b></div>
                            </div>
                        </Row>
                        {/* Form */}
                        <Row>
                            <div className="col-12 px-4">
                                <PostCreation user={props.auth.user} className='px-2' /> 
                            </div>
                        </Row>
                    </div>
                    {/* Rules for the post creation and general */}
                    <div className="col-sm-3">
                        <div className="primary no-hover p-3 mb-2" style={{ }}>
                            <p className="m-1"> <FontAwesomeIcon icon={faExclamationCircle}/> <b>Ricorda alcune regole</b></p>
                            <hr className="m-0"/>
                            <ol className="mt-2">
                                <li>Puoi allegare al massimo 3 foto</li>
                                <li>Puoi selezionale al massimo 3 tag</li>
                                <li>Una volta allegate le immagini e selezionato l'evento associato non saranno più modificabili</li>
                            </ol>
                        </div>
                    </div>
                </Row>
            </Container>
        </CupraTribe>
    );
}
