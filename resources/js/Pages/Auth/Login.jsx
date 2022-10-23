import React, { useEffect } from 'react';
import LoginForm from '@/Forms/Auth/LoginForm';
import SocialFollow from '@/Components/SocialMedia';
import { Head } from '@inertiajs/inertia-react';
import cupra_black from '../../../img/app/logo/cupra-black.png';
import Anchor from '@/Components/Utils/Anchor';

export default function Login() {
    useEffect(() => {
        document.body.style.height = '100%';
    }, []);
    return (
        <>
            <Head title="Login" />
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh' }}
                > 

                <div className='container primary alternative no-hover p-5'>
                    <div className='row'>
                        <div className='row col-4 d-flex justify-content-center m-2'>
                            <div className="row" >
                                <Anchor routeName='home'>
                                    <img
                                        src={cupra_black}
                                        className="img-fluid"
                                        style={{ objectFit: 'cover'}}
                                    />
                                </Anchor>
                            </div>
                            <div className="row align-self-end">
                                <SocialFollow/>
                            </div>
                        </div>
                        <div className='col w-75'>
                            <LoginForm/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
