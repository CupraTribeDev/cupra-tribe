import React, {useEffect, useState} from "react";
import SweetAlert from 'sweetalert2';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import Anchor from "@/Components/Utils/Anchor"

export default function EditDelete({post, className=''}){

    function deletePost(e){
        e.preventDefault();
        swal({
            title: "Sei sicuro?",
            text: "Vuoi elimiare il post? Se è il post ufficiale di un evento verrà cancello anche quello.",
            icon: "warning",
            dangerMode: true,
            buttons: {
                cancel : 'Annulla',
                confirm : {text:'Conferma', className: 'swal-confirm-danger'},
            },
          }).then((flag) => {
            if(flag){
                axios.delete(route('api.content.delete.post', {
                    id: post._id,
                })).then(function (response) {
                    if(response.status == 200){
                        toast('Redirect', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            progress: undefined,
                            theme: 'dark',
                            type: 'warning'
                        })
                        window.location = route('home');
                    }
                })
            }
        });
    }

    function editPost(e){
        e.preventDefault();
        window.location = route('api.content.post.edit', {id: post._id});
    }

    return(
        <div className="ms-auto" style={{alignSelf : "flex-end"}}>
            {/* edit button */}
            <button 
                className="m-1 btn btn-outline-secondary"
                title="Modifica contenuto"
                onClick={editPost}
            >
                <FontAwesomeIcon icon={faEdit} />
            </button>
            {/* delete button */}
            <button 
                title='Eliminia contenuto'
                className="btn btn-outline-danger"
                onClick={deletePost}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    )

}