import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Nav from 'react-bootstrap/Nav';
import { Inertia } from '@inertiajs/inertia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCalendar, faCalendarPlus, faFire, faHome, faNewspaper, faPlus, faQuestion, faToolbox, faInfo } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown, faMessage} from '@fortawesome/free-solid-svg-icons';

import cupra_bianco_lungo from '../../../img/app/logo/cupra-white-long.png'
import cupra_bianco from '../../../img/app/logo/cupra-bianco.png'
import Avatar from "@/Components/User/Avatar";
import Anchor from "@/Components/Utils/Anchor";
import SearchBar from "@/Components/SearchBar";

const Container = styled.div`
  position: fixed;
  .active {
    border-right: 4px solid var(--white)
  }
`;

const Item = styled(Nav)`
`;


export default function Overlay({ user=null, className='' }){
    const [showButton, setShowButton] = useState(false);
    const [logo, setLogo] = useState(cupra_bianco_lungo);
    let inited = false;
    let avatar; 
    let buttons = [];
    let actions = [];
    let links = []


    function logoSelector(e){
        if(window.innerWidth < 1000){ 
            setLogo(cupra_bianco);
        }else if(window.innerWidth >= 1000 ){
            setLogo(cupra_bianco_lungo);
        }
    }

    useEffect(() => {
        if(!inited){
            inited = true;
            logoSelector();
            window.addEventListener("resize", logoSelector);
            window.addEventListener("scroll", () => {
              if (window.pageYOffset > 300) {
                setShowButton(true);
              } else {
                setShowButton(false);
              }
            });
        }
    }, []);
    /*
    links.push(
            <Anchor
                as="button"
                className='button action'
                routeName={'events'}>
                <FontAwesomeIcon icon={faCalendar} />
            </Anchor>
            );
    */

    let param= null
    if(user!=null){
        param= user.username;
    }
    links.push(
            <Anchor
                as="button"
                className='button action'
                routeName={'rules'}
                // method="post"
                // routeParams={{username : param}
            >
                <FontAwesomeIcon title='Rules della Tribe' icon={faInfo} />
            </Anchor>
            );

    if(user != null){
        avatar = (<Avatar user={user.username} size={52}/>);
        buttons.push(
            <Anchor
                routeName='logout'
                method="post"
                className='button primary'
            >
            <span title="Esegui Logout">Logout</span>
            </Anchor>
        );

        actions.push( 
                <Anchor
                    routeName='new.post'
                    method="get"
                    className='button action round'
                >
                        <FontAwesomeIcon title='Crea Post' icon={faPlus} />
                </Anchor>
                );
        actions.push(
                <Anchor
                    routeName='new.event'
                    method="get"
                    className='button action'
                >
                    <FontAwesomeIcon title='Crea Evento' icon={faCalendarPlus} />
                </Anchor>
                );

        if(user.role == 'admin'){
            actions.push(
                <Anchor
                    routeName='dashboard'
                    method="get"
                    className='button action'
                >
                    <FontAwesomeIcon title='Moderazione' icon={faToolbox} />
                </Anchor>
                );
        }
    }
    else{
        buttons.push(<Anchor as="button" className='button primary' routeName={'login'}>Login</Anchor>);
        buttons.push(<Anchor as="button" className='button primary' routeName={'register'}>Registrati</Anchor>);
    }

    return(
        <div>
            <div id="topbar" className={ 'd-flex align-items-center' + className }>
                    <div
                        id="logo"
                        className="me-auto"
                    >
                        <Anchor
                            routeName="home"
                        >
                            <img
                                className="logo"
                                src={logo}
                            />
                        </Anchor>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        {Object.values(links).map((action)=>{
                                return action 
                            })
                        }
                    </div>
		    <SearchBar/>
                    <div className="d-flex align-items-center justify-content-center">
                        {Object.values(actions).map((action)=>{
                                return action
                            })
                        }
                    </div>
                    <div className="d-flex align-items-center me-4">
                        {Object.values(buttons).map((button)=>{
                            return button
                            })
                        }
                    {avatar}
                    </div>
            </div>
        </div>
    );
}
