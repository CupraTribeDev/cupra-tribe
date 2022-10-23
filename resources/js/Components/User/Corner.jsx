import React from "react";

export default function Corner({size=64, children }){

    return(
        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                backgroundColor: 'var(--cp-primary-bg)',
                outline: '3px solid var(--cp-secondary-bg)',
                borderRadius: '50%',
                height: size,
                width: size,
            }}>

            { children }

        </div>
    );
}
