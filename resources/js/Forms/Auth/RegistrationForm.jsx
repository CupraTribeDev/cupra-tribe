import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';

export default function RegistrationForm() {

    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    function onChangeHandler(e) {
        const key = e.target.id;
        const value = e.target.value
        setData(values => ({
            ...values,
            [key]: value,
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        post('/register')
    }
    
    return(
        <Form onSubmit={handleSubmit} onChange={onChangeHandler}>
            <Row>
                <Col>
                <Form.Group controlId="first_name" name="first_name"> 
                    <Form.Label>Nome</Form.Label>
                    <InputGroup className="mb-2">
                        <Form.Control value={data.first_name} type="name" placeholder="Mario"/>
                    </InputGroup>
                    <span>{errors.first_name}</span>
                </Form.Group>
                </Col>
                <Col>
                <Form.Group controlId="last_name"> 
                    <Form.Label>Cognome</Form.Label>
                    <InputGroup className="mb-2">
                        <Form.Control value={data.last_name} type="name" placeholder="Rossi"/>
                    </InputGroup>
                    <span>{errors.last_name}</span>
                </Form.Group>
                </Col>
            </Row>
            <Row>
                <Form.Group className="" controlId="username" name="username">
                    <Form.Label>Username</Form.Label>
                    <InputGroup className="mb-2">
                        <Form.Control value={data.username} type="Username" placeholder="Scegli uno username univico!" />
                    </InputGroup>
                    <span>{errors.username}</span>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group className="" controlId="email" name="email">
                    <Form.Label>Email</Form.Label>
                    <InputGroup className="mb-2">
                        <Form.Control value={data.email}  type="Email" placeholder="La tua Email" />
                    </InputGroup>
                    <span>{errors.email}</span>
                </Form.Group>
            </Row>
            <Form.Group className="" controlId="password" name="password">
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-2">
                    <Form.Control value={data.password} type="password" placeholder="Una password forte" />
                </InputGroup>
                <span> { errors.password } </span>
            </Form.Group>
            <Form.Group className="" controlId="password_confirmation" name="password_confirmation">
                <Form.Label>Conferma Password</Form.Label>
                <InputGroup className="mb-2">
                    <Form.Control value={data.password_confirmation} type="password" placeholder="Una conferma forte" />
                </InputGroup>
                <Form.Text/>
            </Form.Group> 
            <div className="flex items-center d-flex justify-content-center mt-4">
                <a href={route('login')} className="underline text-sm text-gray-600 hover:text-gray-900 cupra-petrol">
                    Hai già un'account? Effettua il Login!
                </a>
            </div>
            <div className="flex items-center d-flex justify-content-center mt-4 mb-4">
                <button type="submit" className="button secondary">Conferma</button>
            </div>
        </Form>
    );
}
