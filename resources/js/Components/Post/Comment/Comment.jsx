import { Col, Row } from "react-bootstrap";
import React, {useState}  from "react";
import Avatar from '@/Components/User/Avatar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faChevronDown, faReply, faTrash } from "@fortawesome/free-solid-svg-icons";
import { CollapserButton, CollapserChild } from "@/Components/Utils/Collapser";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import moment from "moment/min/moment-with-locales";
import parse from 'html-react-parser';
import axios from "axios";
import CommentEditor from "./CommentEditor";

export default function Comment({ user, comment, depth=0, size=32, className= ''}){

    const sanitize = (value) =>{
	if(comment.isdeleted){
	    comment.commented_by_id=null;
	    comment.commented_by_username="[cancellato dal utente]";
	    return '[cancellato dal utente]';
	}
	if(value != null){
	    return value;
	}else{
	    comment.commented_by_id=null;
	    return '[cancellato]';
	}
    }
    const [text, setText] = useState(sanitize(comment.text));

    let delicon = '';
    let report ='';
    if(user != null && comment.commented_by_id === user._id)
    {
        delicon =
        <FontAwesomeIcon
            onClick={deleteComment}
            className="trash"
            icon={faTrash}
        />;
    }else{
	report =
	    <div className="ms-auto" style={{alignSelf : "flex-end"}}>
		<button 
		    className="btn"
		    onClick={ 
			() => { 
			    swal({
				icon: 'warning',
				title: 'Segnalazione',
				text: 'Sei sicuro di voler segnalare il commento di '+ comment.commented_by_username  +' agli amministratori?',
                buttons: {
                    cancel : 'Annulla',
                    confirm : {text:'Conferma', className: 'swal-confirm'},
                },
			    })
			    .then((result) => {
				if(result){
				    axios.put(route('put.comment.report', {id: comment._id})).then((response) => {
					if(response.data.success){
					    swal({
						text: 'Segnalazione inviata agli amministratori.',
						icon: 'success',
						autoClose: 5000,
					    })
					} else {
					    swal({
						text: response.data.msg,
						icon: 'info',
						autoClose: 5000,
					    })

					}
				    })
				}
			    })
			
			}
		    }
		>
		    <FontAwesomeIcon icon={faFlag} fontSize={10} />
		</button>
	    </div>
    }

    async function deleteComment(e){
        e.preventDefault();
        axios.delete(route('api.content.post.comment.delete', {comment_id: comment._id}))
            .then(()=> setText(sanitize(null)));
    }

    let replytoeditor = '';
    let replytobutton = '';
    let chevron = '';
    if(!comment.isdeleted && !comment.isbanned && depth < 3){
	chevron =
            <CollapserButton
                targetTo={'comment-'+comment._id}
                expanded={true}
            >
                <FontAwesomeIcon icon={faChevronDown} />
            </CollapserButton>;
	replytobutton =
		<CollapserButton targetTo={"reply-to-" + comment._id}>
		    <span className="me-1">{comment.replies}</span>
		    <FontAwesomeIcon icon={faReply}/>
		</CollapserButton>;
	replytoeditor =
		<CollapserChild targetName={'reply-to-' + comment._id}>
		    <CommentEditor 
			user={user}
			parentPost={comment.parent_post}
			toComment={comment._id}
		    />
		</CollapserChild>;
    }
    
    if(comment.isdeleted  || text === "[cancellato]")
	return(<></>);
    return(
        <Row
	    id={comment._id}
	    className="comment"
	>
            <Col
                style={{
                    maxWidth: size,
                    position: 'relative',
                    top: size/2
                }}
            >
                <Row>
                <Avatar
                    size={size}
                    user={comment.commented_by_username}
                />
                </Row>
            </Col>
            <Col
                className="comment-content primary">
                <div className="comment-user">{comment.commented_by_username}</div>
                <div className="comment-date">{moment(comment.created_at).fromNow()}</div>
                <div className="comment-text">
                    {parse(text)}
                </div>
                <div className="comment-actions d-flex align-items-center">
                    <div className="comment-actions-stats">
                        <div className="stat">
			{replytobutton}
                        </div>
                    </div>
                    <div className="d-flex ms-auto align-items-center">
                        {delicon}
			{report}
                        {chevron}
                    </div>
                </div>
		{replytoeditor}
            </Col>
        </Row>
    );
}
