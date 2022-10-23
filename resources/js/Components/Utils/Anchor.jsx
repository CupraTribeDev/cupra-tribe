import React from "react";
import { Link } from "@inertiajs/inertia-react";

export default function Anchor({routeName, method='get', routeParams={}, className='', style={},children }) {
    return(
        <Link
            key={"linkto-"+routeName}
            href={route(routeName, {...routeParams})}
            className={className}
            method={method}
            style={{
                textDecoration: 'none',
                ...style
            }}
        >
            {children}
        </Link>
    );
}
