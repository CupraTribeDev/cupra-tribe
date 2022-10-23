import React, { useState, useEffect } from 'react';
import TagContainer from "@/Components/TagContainer";
import { Container, Row, Col, Button, Tabs, Tab } from "react-bootstrap";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import it from "date-fns/locale/it";
import queryString from 'query-string';
import moment from "moment/min/moment-with-locales";

export default function FiltersContainer(className) {
    
    const [startDateEvent, setStartDateEvent] = useState()
    const [endDateEvent, setEndDateEvent] = useState()

    let params = queryString.parse(location.search);
    let searchParams = new URLSearchParams(window.location.search);

    useEffect( () => {
	if(params.eventstart && moment(params.eventstart).isValid()){
	    setStartDateEvent(new Date(params.eventstart));
	}
	if(params.eventend && moment(params.eventend).isValid()){
	    setEndDateEvent(new Date(params.eventend));
	}
	if(params.location){
	    $("#luogo").val(params.location)
	}
    }, [])

    function handleEventStart(e){
        setStartDateEvent(e);
	if(e > endDateEvent){
	    setEndDateEvent(e);
	}
    }
    function handleEventEnd(e){
        setEndDateEvent(e);
	if(e < startDateEvent){
	    setStartDateEvent(e);
	}
    }

    function handleSubmit(e){
        e.preventDefault();
        e.target.disabled = true;

	searchParams.delete("eventstart");
	if(startDateEvent){
	    searchParams.append("eventstart", moment(startDateEvent).format("yyyy-MM-DD"));
	}

	searchParams.delete("eventend");
	if(endDateEvent){
	    searchParams.append("eventend", moment(endDateEvent).format("yyyy-MM-DD"));
	}
	
	searchParams.delete("location");
	var luogo = document.getElementById("luogo").value
	if(luogo){
	    searchParams.append("location", luogo);
	}

	window.location.search = searchParams.toString();
    }

    

    return (
	<Container
            id="tag-container"
            className={ "no-hover primary card my-2 " + className } style={{position:'sticky', top:'80px', borderRadius:'0px'}}>
	    <Row style={{textAlign:"center"}}>
		<h4 className='text-white pt-3 m-0'>Filtri Ricerca</h4>
	    </Row>
	    <Tabs
			defaultActiveKey="postsfilters"
			onSelect=''
			className="m-3"
			justify
		>
		<Tab eventKey="postsfilters" title="Post">
		    <Row><TagContainer tagType="post"/></Row>
		</Tab>
		    <Tab className="align-content-center" style={{flexDirection:"column"}} eventKey="eventsfilters" title="Eventi">
				<div className="container">
					<div className="row d-flex">
						<Col className='col-6 px-4 py-1'>
							<DatePicker 
								placeholderText="Da:"
								selected={startDateEvent}
								onChange={handleEventStart}
								showMonthDropdown
								dateFormat="dd/MM/yyyy"
								locale={it}
							/>
						</Col>
						<Col className='col-6 px-3 py-1'>
							<DatePicker 
								placeholderText="A:"
								className='d-flex justify-content-center'
								selected={endDateEvent}
								onChange={handleEventEnd}
								showMonthDropdown
								dateFormat="dd/MM/yyyy"
								locale={it}
							/>
						</Col>
					</div>
					<div className='row d-flex px-4 py-2'>
						<input
							type="text"
							id="luogo"
							placeholder="Luogo"
							name="luogo" 
							className='bg-dark'
							style={{border:'0px', padding:'10px', height:'58px', width:'99%'}}
						/>
						<div className='d-flex justify-content-center'>
							<button className='my-3 button primary' onClick={handleSubmit}>Applica Filtri</button>
						</div>
					</div>
				</div>
		    <Row><TagContainer tagType="event"/></Row>
		</Tab>
	    </Tabs>
	</Container>
    );
}
