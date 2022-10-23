import React, {useEffect, useState} from "react";
import Avatar from "@/Components/User/Avatar";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function PostDetails({post}) {
        
    if(post.info=="comment"){
        return (
            <div >
                <Row className="mt-3">
                    <Col className="col-sm-1 p-0" style={{ display: 'flex', justifyContent:"center", maxWidth:'80px'}}>
                        <Avatar user={post.profile} size={25}/>
                    </Col>
                    <Col className="col-sm-4 p-0" style={{ display: 'flex', alignItems:"end"}}>
                        <p style={{display:"contents"}}>Commentato da {post.profile}</p> 
                    </Col>
                </Row>
                <hr className="mb-0"/>
            </div>
        );
    }
    if(post.info=="like"){
        return (
            <div className="ps-3">
                <Row className="mt-3">
                    <Col className="col-sm-1 p-0" style={{ display: 'flex', justifyContent:"center", maxWidth:'80px'}}>
                        <Avatar user={post.profile} size={25}/>
                    </Col>
                    <Col className="col-sm-4 p-0" style={{ display: 'flex', alignItems:"end"}}>
                        <p style={{display:"contents"}}>Consigliato da {post.profile}</p> 
                    </Col>
                </Row>
                <hr className="mb-0"/>
            </div>
        );
    }

    return null;
}
