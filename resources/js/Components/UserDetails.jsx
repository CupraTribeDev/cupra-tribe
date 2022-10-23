import { Col, Container, Row } from "react-bootstrap";
import React, {useState} from "react";
import styled from "styled-components";
import {Inertia} from "@inertiajs/inertia";
import { Link } from '@inertiajs/inertia-react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { truncateText } from "@/scripts/truncatetext";
import Avatar from 'react-avatar';

const AvatarContainer = ({children}) => {
    return(
    <div className='border transparent border-2 cupra-copper-border' style={{ borderRadius: '50%', width: '65px', height: '65px'}}>
        {children}
    </div>);
};

export default function UserDetails({ user, className= ''}){
    return(
        <Container className={ "rounded border bg-dark-cupra-petrol text-white" + className}>
	    <p>{user.email}</p>
	    <p>{user.username}</p>
        </Container>
    );
}
