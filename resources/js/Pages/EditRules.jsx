import React, { useState } from "react";
import CupraTribe from '@/Layouts/CupraTribe';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { Editor } from "react-draft-wysiwyg";
import { useForm } from '@inertiajs/inertia-react';
import { convertToRaw, EditorState, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-toastify/dist/ReactToastify.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


export default function EditRules(props) {

    const { data, setData, post, processing, errors } = useForm({
        text: props.rules.text,
    });
    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(ContentState.createFromBlockArray(
            convertFromHTML('<p>' + props.rules.text + '</p>')
        )),
    );

    function onEditorChangeHandler(e) {
        setEditorState(e);
        setData(values => ({
            ...values,
            "text": draftToHtml(convertToRaw(e.getCurrentContent()))
        }));

    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('api.rules.update'));
    }

    return (
        // <div style={{color: "white"}}>CIAO</div>
        <CupraTribe user={props.user}>
            <div className="container-lg p-2 p-3 rounded border bg-dark-cupra-petrol text-white">
                <div>
                    <h3 className="mb-1 mt-2">Regole della Tribe</h3>
                </div>
                <hr className="mt-1" />
                <div className="px-5 py-2">
                    <Editor
                        onEditorStateChange={onEditorChangeHandler}
                        editorState={editorState}
                        wrapperClassName="reply-form wrapper"
                        editorClassName="post-form editor"
                        toolbarClassName="reply-form toolbar"
                        placeholder='Scrivi le regole...'
                        toolbar={{
                            options: ['emoji', 'inline'],
                            inline: {
                                options: ['bold', 'italic', 'underline', 'strikethrough']
                            }
                        }}
                        wrapperStyle={{
                            height: '100vh',
                            overflow: "hidden",
                            width: '100%',
                        }}
                    />
                </div>
                <Col className="col col-button-submit">
                    <Button className="button-submit button primary my-4 me-4" href={route('rules')} type="submit">Annulla</Button>
                    <Button className="end-button button-submit button primary my-4" onClick={handleSubmit} type="submit">Salva</Button>
                </Col>
            </div>
        </CupraTribe>
    );
}
