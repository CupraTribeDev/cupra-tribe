import React, {useState}  from "react";
import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from 'draft-js';
import {useForm} from "@inertiajs/inertia-react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Anchor from "@/Components/Utils/Anchor";
import {Button} from "react-bootstrap";

export default function CommentEditor({parentPost, toComment="nan", user=null}){ 

    const {data, setData, post, processing, errors} = useForm({
        id: parentPost,
        reply_to: toComment,
        text: "",
    });

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty(),
    );


    async function submitComment(e){
        e.preventDefault();
	if(data.text != "")
	    post(route('api.content.post.comment.new'));
	else{
	    swal({
		icon: 'warning',
		title: 'messaggio vuoto'
	    });
	}
    }

    function onChangeHandler(e) {
        setEditorState(e);
        setData(values =>({
            ...values,
            "text": draftToHtml(convertToRaw(e.getCurrentContent())),
            "original": editorState.toJS(),
        }));
    }

    if(user === null){
        return(
            <h3>
                <Anchor routeName={"register"}>Registrati </Anchor> o <Anchor routeName={"login"}> Accedi </Anchor> per poter commentare
            </h3>
        );
    }else{
        return(
            <div
                id="comment-editor"
                className=''>
                <Editor 
                    onEditorStateChange={onChangeHandler}
                    editorState={editorState}
                    wrapperClassName="reply-form wrapper"
                    editorClassName="reply-form editor"
                    toolbarClassName="reply-form toolbar"
                    toolbar={{
                        options: ['emoji','inline'],
                        inline: {
                            options: ['bold','italic','underline','strikethrough']
                        }
                    }}
                    wrapperStyle={{
                        height:'25vh',
                        overflow: "hidden",
                        width: '100%',
                    }}
                />
                <Button
                    className="primary button"
                    onClick={submitComment}
                >
                    Pubblica
                </Button>
            </div>
        );
    }
}
