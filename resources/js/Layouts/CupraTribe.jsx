import React from 'react';

import {Head} from '@inertiajs/inertia-react';
import Overlay from '@/Forms/Overlay/Overlay';


export default function CupraTribe({ title, user=null, children}) {
    return(
        <div>
            <Head title={ title } />
            <Overlay user={user} />
            <div id="white-space" style={{ height: '100px' }} />
            <div className="container-fluid pb-4">
                {children}
            </div>
        </div> 
    );
}
