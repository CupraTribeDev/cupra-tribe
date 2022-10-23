import React, { Component, useState, useEffect } from "react";
import CupraTribe from '@/Layouts/CupraTribe';
import Anchor from "@/Components/Utils/Anchor";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Parser from 'html-react-parser';


export default function Rules(props) {

    let edit= null;
    let content= "";

    if(props.auth.user!= null && props.auth.user.role == 'admin'){
	edit=
	    <div className="d-flex">
		<Button className="ps-0 ms-5" size="lg" variant="link">
		    <Anchor
			routeName={"api.rules.edit"}
			// routeParams={{username: props.auth.user.username}}
		    >
			<FontAwesomeIcon icon={faPenToSquare}/>
		    </Anchor>
		</Button>
	    </div>
	}
	else{
		edit= null;
	}

    if(props.rules.text!=null){
        content= props.rules.text;
    }

    return (
        // <div style={{color: "white"}}>CIAO</div>
        <CupraTribe user={props.auth.user}>
            <div className="container-lg p-2 p-3 rounded border bg-dark-cupra-petrol text-white">
                <div className="d-flex pt-2 px-2"  style={{display: 'flex', alignItems: 'baseline'}} >
                    <p style={{display:'contents'}}>Regole della Tribe</p> {edit}
                </div>
                    <hr className="mt-1" />
                <div className="px-5 py-2">
                    {Parser(content)}
                </div>

            </div>
        </CupraTribe>
    );
}
