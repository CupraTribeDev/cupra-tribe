import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
/* our components */
import CupraTribe from '@/Layouts/CupraTribe';
import Avatar from "@/Components/User/Avatar";
/* import for bootstrap */
import {Container, Form, Row, Col, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCoins, faExclamationCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
/* import for the form */
import { DropzoneArea} from 'material-ui-dropzone';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState , ContentState, convertFromHTML} from 'draft-js';
import { Data } from '@react-google-maps/api';

/*
##############################################################################################################################
ToDo
##############################################################################################################################
[] sistemare la visualizzazione del contenuto del post
[] trasformare le regole in un componente
[] far eseguire il redirect solo dopo aver fatto completare la notifica toast/popup
*/

export default function PostEdit(props){

    const [apiToken, setToken] = useState(false);
    const [tags, setTags] = useState();
    const [events, setEvents] = useState([]);
    const [selected, setSelected] = useState([]);
    //hook per tenere traccia dello stato della form
    const { data, setData, put, processing, errors } = useForm({
        title: props.post.title,
        text: props.post.text,
        event: props.post.event_id,
        tags: props.post.tags,
    });
    // to make the editor a controlled component
    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(data.text)))
    );
    //custom style for react-select
    const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: '#202529',
      border: '0px',
      borderColor: 'var(--engine-grey)',
      boxShadow: state.isFocused ? null : null,
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      minHeight: '60px',
      padding: '8px 14px',
      overflow: 'scroll',
      background: '#202529',
    }),
    input: (provided, state) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: state => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '30px',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      backgroundColor: '#202529'
    })
    };

    /* 
    ###################################################################################################
    Handler dei componenti della Form
    ######################################################################################################
    */
    const themes = (theme) => ({
    ...theme,
    borderRadius: 0,
    colors: {
    ...theme.colors,
      text: 'var(--oxygen-white)',
      font:'#202529',
      primary25: 'var(--cp-cupra-copper)',
      primary: 'var(--cp-cupra-copper)',
      neutral80: 'black',
      color: 'black',
    },
    });
  
    function handleChangeSelect(e){
        setSelected(e)
        setData(values => ({
            ...values,
            tags: (Array.isArray(e) ? e.map((x) => x.value) : []),
        }));
    };
  
    function onChangeHandler(e) {
        const key = e.target.id;
        const value = e.target.value
        setData(values => ({
            ...values,
            [key]: value,
        }));
        console.log(data)
    }
  
    function handleSubmit(e) {
        e.preventDefault();
        e.target.disabled = true;
        put(route('post.edit', {id: props.post._id}), {
            onSuccess: (res) => {
            new swal({
                title:'Success', 
                text:'Post modificato con successo!',
                icon: 'success',
                buttons: {
                    confirm : {text:'Ok', className: 'swal-confirm'},
                },
            
            }).then( () => {
                window.location = route('home');
            })
            }});
    }

    function onEditorChangeHandler(e) {
        setEditorState(e);
        setData(values =>({
          ...values,
          "text": draftToHtml(convertToRaw(e.getCurrentContent()))
      }));
    
    }
    
    /* 
    ###################################################################################################
    Side function
    ######################################################################################################
    */
    async function getApi() {
    }
  
    useEffect(() => {
      Object.values(errors).map((error) => { toast(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        progress: undefined,
        theme: 'dark',
        type: 'warning'
        });})
    }, [errors]) 
  
    useEffect(()=>{
        if(!apiToken) getApi();
        let t = [];
        axios.get(route("api.content.tags")).then((response) => {
            t = response.data;
            let tagsarray =[]
            t.forEach(tag => { tagsarray.push({ value: tag._id, label: tag.name}) });
            setTags(tagsarray);
            let select = []
            tagsarray.find(element => {
                if(element.value == props.post.tags[0]){
                    select.push(element)
                }
                if(element.value == props.post.tags[1]){
                    select.push(element)
                }
                if(element.value == props.post.tags[2]){
                    select.push(element)
                }
            })
            setSelected(select)
        })
        .catch((error) => { console.log(error); });
    }, []);

    return(
        <CupraTribe user={props.auth.user} title="Homepage">
            <Container>
                <Row className="d-flex">
                    <h1 className="oxygen-white m-2 px-3"><FontAwesomeIcon icon={faEdit} /> Modifica Post</h1>
                    <hr className="oxygen-white" />
                </Row>
            </Container>
            <Container className="my-3">
                <Row className="m-3" style={{borderRadius: '0px'}}>
                    {/* Form for the post creation */}
                    <div className="col-sm-9 p-0 primary">
                        {/* Info user */}
                        <Row className="mx-4 mt-3 py-3">
                            <div className="col-1 mx-2 px-4">
                                <Avatar user={props.auth.user.username}/>
                            </div>
                            <div className="col-8 p-2 my-auto">
                                <div className="mt-4"  style={{display:'inline'}}><p style={{display:'inline', color:'var(--engine-grey)'}}>Creatore del post: <b>&#xf007; {props.auth.user.username}</b></p></div>
                                <div  style={{ color:'var(--engine-grey)'}} >Cupra Points: <b><FontAwesomeIcon icon={faCoins}/> 1234</b></div>
                            </div>
                        </Row>
                        {/* Form */}
                        <Row>
                            <div className="col-12 px-4">
                                <Form onChange={onChangeHandler}>
                                    {/* Input Text per il Titolo del Post */}
                                    <Row className='m-3'>
                                        <Form.Group controlId="title"> 
                                            <Form.Control
                                                name="title"
                                                type="name"
                                                className='bg-dark'
                                                value={data.title}
                                                style={{color:'var(--oxygen-white)', border:'0px',minHeight:'58px', borderRadius:'0px'}}
                                            />
                                        </Form.Group>
                                    </Row>
                                    {/* Text Editor fot the conetnt of the post */}
                                    <Row className='m-3'>
                                        <Editor 
                                            onEditorStateChange={onEditorChangeHandler}
                                            editorState={editorState}
                                            wrapperClassName="reply-form wrapper"
                                            editorClassName="post-form editor"
                                            toolbarClassName="reply-form toolbar"
                                            value={data.text}
                                            toolbar={{
                                                options: ['emoji','inline'],
                                                inline: {
                                                    options: ['bold','italic','underline','strikethrough']
                                                }
                                            }}
                                            wrapperStyle={{
                                                height:'25vh',
                                                overflow: "hidden",
                                                width: '97%',
                                            }}
                                        />
                                    </Row>
                                    {/* Select for tags */}
                                    <Row className='m-4'>
                                        <div className='col-9 p-0'>
                                            <Form.Group controlId="tags" className='p-2 pt-0' name="tags" styles={{minHeight:'500px', height:'500px', overflow:'scroll'}}>
                                                {selected !== undefined && (
                                                    <Select
                                                        placeholder='&#xf02c; &nbsp; Tag'
                                                        options={tags}
                                                        value={selected}
                                                        onChange={handleChangeSelect}
                                                        isMulti
                                                        styles={customStyles}
                                                        theme={themes}
                                                    />
                                                )}
                                            </Form.Group>
                                        </div>
                                        <div className=" col-3 flex items-center d-flex justify-content-start py-2 my-2">
                                            <button className='btn btn-outline-success mx-1' onClick={handleSubmit}>Salva</button>
                                            <button className='btn btn-outline-warning mx-1' onClick={()=> {history.back()}}>Annulla</button>
                                        </div>
          
                                    </Row>
                                    <ToastContainer/>
                                </Form>
                            </div>
                        </Row>
                    </div>
                    {/* Rules for the post creation and general */}
                    <div className="col-sm-3">
                        <div className="primary p-3 mb-2" style={{ }}>
                            <p className="m-1"> <FontAwesomeIcon icon={faExclamationCircle}/> <b>Ricorda alcune regole</b></p>
                            <hr className="m-0"/>
                            <ol className="mt-2">
                                <li>Puoi allegare al massimo 3 foto</li>
                                <li>Puoi selezionale al massimo 3 tag</li>
                                <li>Una volta allegate le immagini e selezionato l'evento associato non saranno più modificabili</li>
                            </ol>
                        </div>
                        <div className="primary p-3">
                            Altre regole
                        </div>
                    </div>
                </Row>
            </Container>
        </CupraTribe>

    )
}
