import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPhone, faMailBulk, faPersonRunning, faUsers, faLocationDot, faUserPlus, faTag } from '@fortawesome/free-solid-svg-icons'

export default function EventInfo(props, icon, key, value){
    return(
        <div>
            <p style={{display:'inline', color:'var(--engine-grey)'}}>
                <FontAwesomeIcon className='mx-1' style={{width:'14px'}} icon={icon}/>{key}
                <p style={{display:'inline'}}> {value} </p><br/>
            </p>
        </div>
    )
}