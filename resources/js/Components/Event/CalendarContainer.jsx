import React from "react";
import { BaseContainer } from "./_styles";


export default function CalendarContainer({ className="", children }){
    return(
        <BaseContainer 
            id="event-calendar"
            className={ "d-flex flex-column justify-content-center align-items-center mt-2 pb-4" + className }
            style={{
            }}
        >
            {children}
        </BaseContainer>
    );
}
