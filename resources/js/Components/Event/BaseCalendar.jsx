import axios from "axios";
import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import moment from 'moment';
import CCalendar from "./Calendar";

class BaseCalendar extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            date: new Date(),
            monthEvents: [],
        };

        this.firstCall = true;
	this.fatherOnClick = props.onClick;
    }
   
    onChangeHandler = async (newDate, e) => {
        let realDate = moment(newDate).format('YYYY-MM-01');
        let currentDate = moment(this.state.date).format('YYYY-MM-01');
        if(realDate !== currentDate || this.firstCall){
            this.firstCall = false;
            let monthRes = await axios.get(
                route(
                    'api.content.events.get.mini.month',
                    {date: realDate})
            );
             this.setState({monthEvents: monthRes.data});
        }
        this.setState({date: newDate}, () => { this.props.output(newDate) } );
    }

    onClickHandler = async (newDate, e) => {
	this.fatherOnClick();
	this.onChangeHandler(newDate, e);
    }


    componentDidMount(){
        this.onChangeHandler(this.state.date);
    }

    render() {
        //tileContentUpdate is INSIDE render function because it is dinamically called
        //functions OUTSIDE the render runction will not be updated as they act like a state
        const tileContentUpdate= ({ date, view }) => {
          // Add class to tiles in month view only
          if (view === 'month') {
            let realdate = moment(date).format('YYYY-MM-DD');
            if(this.state.monthEvents.find(val=> val===realdate))
                return <div style={{ position: 'relative', textAlign: 'center', width: '100%' }}>⋅</div>;
            else
                return <div style={{ position: 'relative', textAlign: 'center', width: '100%' }}><br/></div>;
          }
        }

        return(
            <div className="mt-2">
            <Calendar
                onClickDay={this.onClickHandler}
                onClickMonth={this.onChangeHandler}
                value={this.state.date}
                tileContent={tileContentUpdate}
               />
            </div>
        );
    }
}

export default BaseCalendar;

