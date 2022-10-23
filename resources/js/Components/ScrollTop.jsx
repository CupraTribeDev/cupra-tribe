import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons'
import styled from "styled-components";


export default function Scrolltop(){
    
    const [isVisibile, setVisible] = useState(false);
    const toogle = () => { 
        if(window.pageYOffset > 1000) setVisible(true)
        else setVisible(false)
    }
    const scrollTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' })}
    
    useEffect(() => { 
        window.addEventListener('scroll',toogle)
        //una volta che il comopnente viene smontato è necessario rimuovere l'event listener dalla window 
        return () => { window.removeEventListener('scroll', toogle)}
    },[])
    const Top = styled.div`
	animation: ${isVisibile ? 'totop' : 'tobottom' } 1s linear;
	-webkit-animation: ${isVisibile ? 'totop' : 'tobottom' } 1s linear;
	position: fixed;
	bottom: ${isVisibile ? '10px' : '-100px'};
    `;    
    
    
    return (
        <Top
            className='d-flex justify-content-center'
        >
            <Button
            className='button primary'
            onClick={scrollTop}>
                <FontAwesomeIcon 
                    size='24px'
                    style={{width:'14px'}}
                    icon={faArrowAltCircleUp}/>
        </Button>
        </Top>
    );

}
