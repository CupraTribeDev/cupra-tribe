import React from "react";

export function CollapserButton({targetTo, expanded=false, children}){
    return(
        <div
            className="col"
            data-bs-toggle="collapse"
            data-bs-target={"#" + targetTo}
            aria-expanded={expanded}
        >
        {children}
        </div>
    );
}

export function CollapserChild({targetName, expanded=false, children}){
    let collapse = expanded? 'show' : '';

    return(
        <div id={targetName} className={ collapse + " collapse mb-1"}
            style={{
                width: '100%'
            }}
        > 
        {children}
        </div>
    );
}
