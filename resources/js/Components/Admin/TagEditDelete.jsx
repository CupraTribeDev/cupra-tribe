import React, {useEffect, useState} from "react";
import SweetAlert from 'sweetalert2';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faTrash} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import Anchor from "@/Components/Utils/Anchor"

export default function TagEditDelete(props){

    var name = props.tag.name

    function deleteTag(e){
        e.preventDefault();
        swal({
            title: "Sei sicuro?",
            text: "Vuoi eliminare il tag? Sarà rimosso da tutti i post che lo conterranno.",
            icon: "warning",
            dangerMode: true,
            buttons: {
                cancel : 'Annulla',
                confirm : {text:'Conferma', className: 'swal-confirm-danger'},
            },
          }).then((flag) => {
            if(flag){
                axios.delete(route('api.content.delete.tag', {
                    id: props.tag._id,
                })).then(function (response) {
                    if(response.status == 200){
			props.setTags(props.tags.filter(function(value){
			    return value._id != props.tag._id
			}))
                    }
                })
            }
        });
    }

    function editTag(e){
        e.preventDefault();
        swal({
            title: "Modifica tag",
	    text: "Inserire nuovo nome tag:",
            icon: "info",
	    content: "input",
	    inputTextColor: "#000000",
            dangerMode: true,
	    buttons: ["Annulla", "Salva"],
          }).then((input) => {
            if(input){
                axios.put(route('api.content.edit.tag', {
                    id: props.tag._id,
		    name: input
                })).then(function (response) {
                    if(response.status == 200){
			window.location = route("dashboard")
                    }
                })
            }
        });
    }

    return(
        <div className="ms-auto" style={{alignSelf : "flex-end"}}>
            {/* edit button */}
            <button 
                className="m-1 btn btn-outline-secondary"
                onClick={editTag}
            >
                <FontAwesomeIcon icon={faEdit} />
            </button>
            {/* delete button */}
            <button 
                className="btn btn-outline-danger"
                onClick={deleteTag}
            >
                <FontAwesomeIcon icon={faTrash} />
            </button>
        </div>
    )

}
