import React from "react";
import CalendarContainer from '@/Components/Event/CalendarContainer';
import BaseCalendar from '@/Components/Event/BaseCalendar';
import { useState } from 'react';
import { EventThumbnail } from './EventThumbnail';
import axios from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {CollapserButton, CollapserChild} from "../Utils/Collapser";


export default function CCalendar(){
    const [events, setEvents] = useState({});
    const [collapse, setCollapse] = useState(false);
    const [noevents, setNoevents] = useState(); 

    async function getEvents(newDate){
        let realDate = moment(newDate).format('YYYY-MM-DD');
        let res = await axios.get(route('get.event.date', {date: realDate}));
        setEvents(res.data.events);
        if(res.data.length == 0)
            setNoevents(() => {return <span> nessun evento </span>;});
        else
            setNoevents(' ');
    }

    function onClickHandler(){
	setCollapse(true);
    }

    return(
        <CalendarContainer>
            <BaseCalendar
		output={getEvents}
		onClick={onClickHandler}
	    />
            <CollapserButton targetTo="cal-events">
                <FontAwesomeIcon
                    className="mb-3"
                    icon={faChevronDown} />
            </CollapserButton>
            <CollapserChild expanded={collapse} targetName="cal-events" >
                {Object.values(events).map((event)=>{
                   return <EventThumbnail event={event}/> 
                })}
                {noevents}
            </CollapserChild>
        </CalendarContainer>
    );
}
