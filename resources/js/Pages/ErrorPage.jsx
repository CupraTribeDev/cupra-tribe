import React from "react";
import CupraTribe from '@/Layouts/CupraTribe';
import { Container } from 'react-bootstrap';
import Anchor from "@/Components/Utils/Anchor";


export default function ErrorPage({ user, status}) {
    const title = {
	503: '503: Service Unavailable',
	500: '500: Server Error',
	404: '404: Page Not Found',
	403: '403: Forbidden',
    }[status]

    const description = {
	503: 'Sorry, we are doing some maintenance. Please check back soon.',
	500: 'Whoops, something went wrong on our servers.',
	404: '404: ci dispiace informarla che la pagina da lei richiesta sembra non esistere :/',
	403: 'Sorry, you are forbidden from accessing this page.',
    }[status]
    return(
        <CupraTribe user={user} title={title}>
            <Container className="my-3">
		<h1 style={{color:"#ffffff"}}>{description}</h1>
		<p style={{color:"#aaaaaa"}}>Torna alla <Anchor routeName={'home'}> Home Page </Anchor></p>
            </Container>
        </CupraTribe>
    );
}
