import React from "react";
/* our components */
import Anchor from "@/Components/Utils/Anchor";
import Avatar from "@/Components/User/Avatar";
/* for bootstrap and other */
import { Card } from "react-bootstrap";;

import tribe from '../../../img/assets/cupra-tribe.jpg'


export default function UserCard({username = null}){

    return(
        <Card
            className="m-1 text-white align-self-center"
            style={{
                width: "70%",
                height: '50px',
                maxHeight: '70px',
                objectFit: 'cover',}}
        >
            <Card.Img 
                src= {tribe}
                alt="Card image"
                style={{overflow:'hidden'}}
            />
            <Card.ImgOverlay className='d-flex align-items-center p-0 cupra-overlay'>
                <Anchor className="m-2"
                    routeName='viewuser'
                    routeParams={{ username : username }}
                >
                    <div className="avatar-profile m-3">
                        <Avatar 
                            user={username}
                            size={32}
                        />
                    </div>
                </Anchor>
                <Card.Title className='m-0 ' style={{display:'block', fontSize:'14px'}}>{ username }</Card.Title><br></br>
            </Card.ImgOverlay>
        </Card>


    )
}

export function UserThumbnail({username = null}){

    return(
	<Anchor
	    routeName="viewuser" 
	    routeParams={{username: username}}
	    className="card"
	    style={{
		border: 'none',
		cursor: 'pointer',
		background: 'none',
		maxHeight: '100px',
		width: '100%',
		maxWidth: '100%',
	    }}
	>
        <Card
	    className="my-2 text-white align-self-center"
            style={{
		width: "87%",
		height: '90px',
		maxHeight: '100px',
		objectFit: 'cover'
	    }}
        >
            <Card.Img 
                src= {tribe}
                alt="Card image"
                style={{overflow:'hidden'}}
            />
            <Card.ImgOverlay className='d-flex align-items-center p-0 cupra-overlay'>
                <Anchor className="m-2"
                    routeName='viewuser'
                    routeParams={{ username : username }}
                >
                    <div className="avatar-profile m-3">
                        <Avatar 
                            user={username}
                            size={32}
                        />
                    </div>
                </Anchor>
                <Card.Title className='m-0 ' style={{display:'block', fontSize:'14px'}}>{ username }</Card.Title><br></br>
            </Card.ImgOverlay>
        </Card>
	</Anchor>


    )
}
