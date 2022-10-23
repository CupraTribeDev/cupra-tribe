import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

import { Inertia } from '@inertiajs/inertia';
import { useForm } from '@inertiajs/inertia-react';

export default function RegistrationForm() {

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
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
        post('/login')
    }
    
    return(
        <Form onSubmit={handleSubmit} onChange={onChangeHandler}>
            <Row>
                <Form.Group className="" controlId="email" name="email">
                    <Form.Label>Email</Form.Label>
                    <InputGroup className="mb-2">
                        <Form.Control type="Email" placeholder="Email o username" />
                    </InputGroup>
                </Form.Group>
            </Row>
            <Form.Group className="" controlId="password" name="password">
                <Form.Label>Password</Form.Label>
                <InputGroup className="mb-2">
                    <Form.Control type="password" placeholder="Password" />
                </InputGroup>
            </Form.Group>
            <span> {errors.email} </span>
            <div className="flex items-center d-flex justify-content-center mt-4">
                <a href={route('register')} className="underline text-sm text-gray-600 hover:text-gray-900">
                    Non hai un account? Registrati!
                </a>
            </div>
            <div className="flex items-center d-flex justify-content-center mt-4 mb-4">
                <Button type="submit">Conferma</Button>
            </div>
        </Form>
    );
}
