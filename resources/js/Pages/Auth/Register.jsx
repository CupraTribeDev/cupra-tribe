import React, { useEffect } from 'react';
import RegistrationForm from '@/Forms/Auth/RegistrationForm';
import Button from 'react-bootstrap/Button';
import SocialFollow from '@/Components/SocialMedia';
import { Head } from '@inertiajs/inertia-react';
import axios from 'axios';
import cupra_black from '../../../img/app/logo/cupra-black.png';

axios.get('/sanctum/csrf-cookie').then(response => {});

export default function Register() {
    useEffect(() => {
        document.body.style.height = '100%';
    }, []);

    return (
    <>
            <Head title="Register" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}> 
                <div className='container p-5 w-50 primary alternative'>
                    <div className='row'>
                        <div className='col-4 row d-flex justify-content-center m-2'>
                            <div className="row" >
                                <a href={ route('home') }> <img src={cupra_black} className="img-fluid" style={{ objectFit: 'cover'}} /> </a>
                            </div>
                            <div className="row align-self-end">
                                <SocialFollow/>
                            </div>
                        </div>
                        <div className='col w-75 desert-sand-bg'>
                            <RegistrationForm />
                        </div>
                    </div>
            </div>
        </div>
    </>
    );
}
