import React, { useEffect, useState } from "react";
import { useForm } from '@inertiajs/inertia-react';
/* our components */
import CupraTribe from '@/Layouts/CupraTribe';
import Avatar from "@/Components/User/Avatar";
/* compoonents of the form */
import Select from 'react-select';
import { DropzoneArea} from 'material-ui-dropzone';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
/* import for text editor*/
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from 'draft-js';
import parser from 'html-react-parser';
/* import for bootstrap */
import { ProgressBar, Button, Container, Col, Row, Form, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarCheck, faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
/* import for toast notification */
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import it from "date-fns/locale/it";
import moment from "moment/min/moment-with-locales";

export default function NewEvent(props){ 

    // method to retrieve the api token
    const [apiToken, setToken] = useState(false);
    async function getApi() {
    }
    /*
    ##################################################################################
    Text Editor
    ##################################################################################
    */
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty(),
    );
    function onEditorChangeHandler(e) {
        setEditorState(e);
        setData(values =>({
          ...values,
          "event_description": draftToHtml(convertToRaw(e.getCurrentContent()))
      }));
    
    }
    const [editorStatePost, setEditorStatePost] = useState(() =>
        EditorState.createEmpty(),
    );
    function onEditorChangeHandlerPost(e) {
        setEditorStatePost(e);
        setData(values =>({
          ...values,
          "post_text": draftToHtml(convertToRaw(e.getCurrentContent()))
      }));
    
    }
    /*
    #################################################################################
    React Select and API calls for select
    #################################################################################
    */
    const [tags, setTags] = useState([]);
    const [type, setType] = useState([]);
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
        color: 'var(--cp-oxygen-white)',
        },
    });
    function handleChangeSelectTags(e){
        setData(values => ({
            ...values,
            post_tags: (Array.isArray(e) ? e.map((x) => x.value) : []),
        }));
        setData(values => ({
            ...values,
            post_tags_name: (Array.isArray(e) ? e.map((x) => x.label) : []),
        }));
    };
    function handleChangeSelectType(e){
        setData(values => ({
            ...values,
            event_type: e.label,
        }));
    };
    useEffect(()=>{
        if(!apiToken) getApi();
        var t = [];
        axios.get(route("api.content.tags.post")).then((response) => {
            t = response.data;
            var tagsarray =[]
            t.forEach(tag => { tagsarray.push({ value: tag._id, label: tag.name}) });
            setTags(tagsarray); 
        })
        .catch((error) => { console.log(error); });
    }, []);   
    useEffect(()=>{
        if(!apiToken) getApi();
        var t = [];
        axios.get(route("api.content.tags.event")).then((response) => {
            t = response.data;
            var tagsarray =[]
            t.forEach(tag => { tagsarray.push({ value: tag._id, label: tag.name}) });
            setType(tagsarray); 
        })
        .catch((error) => { console.log(error); });
    }, []);
    /* 
    #################################################################################
    File Upload
    #################################################################################
    */
    function onFileChangeEvent(e){
        setData(values => ({
            ...values,
            event_files: (Array.isArray(e) ? e.map((x) => x) : e[0]),
        }));
    } 
    function onFileChangePost(e){
        setData(values => ({
            ...values,
            post_files: (Array.isArray(e) ? e.map((x) => x) : e[0]),
        }));
    }
    /*
    #################################################################################
    DatePicker
    #################################################################################
    */
    const [startTime, setStartTime] = useState();
    const [startDate, setStartDate] = useState();
    function handleChangeTime(e){
        setStartTime(e);
        setData(values => ({
            ...values,
            event_time: moment(e, 'hh:mm a').format('HH:mm'),
        }))
    }
    function handleChangeDay(e){
        setStartDate(e);
        setData(values => ({
            ...values,
            event_date: e.toLocaleDateString(),
        }))
    }
    /* 
    ###################################################################################################
    Form Handler and Errors
    ######################################################################################################
    */
    const { data, setData, post, processing, errors } = useForm({
        /* event */
        event_title: '',
        event_description: '',
        event_place: '',
        event_time : '',
        event_type: '',
        event_date: '',
        event_files: [],
        /* post */
        post_title: '',
        post_text: '',
        post_tags: [],
        post_tags_name: [], 
        post_files: [],
    });
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
    function onChangeHandler(e){
        const key = e.target.id;
        const value = e.target.value
        setData(values => ({
            ...values,
            [key]: value,
        }));
        console.log(data);
    }
    function handleSubmit(e) {
        e.preventDefault();
        e.target.disabled = true;
        post(route('api.content.event.new'), {
            onSuccess: (res) => {
              new swal({
                title:'Success', 
                text:'Evento creato con successo!',
                icon: 'success',
                buttons: {
                    confirm : {text:'Ok', className: 'swal-confirm'},
                },
            
            }).then( () => {
                window.location = route('home');
              })
            }
        });
    }
    /* 
    ###################################################################################################
    Codice del componente
    ######################################################################################################
    */
    return(
        <CupraTribe user={props.auth.user} title="Homepage">
            {/* Name of the Page - Create Event */}
            <Container>
                <Row className="d-flex">
                    <h1 className="oxygen-white m-2 px-3"><FontAwesomeIcon icon={faCalendarCheck}  /> Crea Evento</h1>
                    <hr className="oxygen-white" />
                </Row>
            </Container>
            <Container className="my-3">
                <Row className="m-3">
                    {/* Container of the form */}
                    <div className="col-sm-12 p-0 primary no-hover">
                        {/* User Info */}
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
                        <Row className="m-2 p-3">
                            <Form onChange={onChangeHandler} > 
                                <Tabs
                                    defaultActiveKey="event"
                                    id="justify-tab-example"
                                    className="m-3"
                                    justify
                                >
                                    {/*
                                    ##################################
                                    Tabs for the event
                                    ##################################
                                    */}
                                    <Tab 
                                        eventKey="event"
                                        className="m-4"
                                        title=" &#xf133; &nbsp; Event">
                                        {/* Title and type of event */}
                                        <Row>
                                            {/* Input per il title dell'Evento */}
                                            <div className='col-sm-12'>
                                                <Form.Group 
                                                    controlId="event_title" 
                                                > 
                                                    <Form.Control
                                                        placeholder="Titolo"
                                                        name="title"
                                                        style={{color:'var(--oxygen-white)', border:'0px', minHeight:'58px', borderRadius:'0px'}}
                                                        className='bg-dark'
                                                        type="name"
                                                    />
                                                </Form.Group> 
                                            </div>
                                            {/* Input per la tipologia dell'evento, vedere se modificare con una select se presente la tabella dal database */}
                                        </Row>
                                        {/* Text Editor for event description */}
                                        <Row className='mt-3'>
                                            <Editor 
                                                onEditorStateChange={onEditorChangeHandler}
                                                editorState={editorState}
                                                wrapperClassName="reply-form wrapper"
                                                editorClassName="post-form editor"
                                                toolbarClassName="reply-form toolbar"
                                                placeholder='Descrizione'
                                                toolbar={{
                                                    options: ['emoji','inline'],
                                                    inline: {
                                                        options: ['bold','italic','underline','strikethrough']
                                                    }
                                                }}
                                                wrapperStyle={{
                                                    height:'25vh',
                                                    overflow: "hidden",
                                                    width: '99%',
                                                }}
                                            />
                                        </Row>
                                        {/* Evento info like place and time */}
                                        <Row className="mt-3">
                                            {/* Dropzone per l'upload delle immagini dell'evento */}
                                            <Col className="col-6 w-50">
                                                <DropzoneArea
                                                    name='event_files'
                                                    acceptedFiles={['image/*']}
                                                    cancelButtonText={"cancel"}
                                                    submitButtonText={"submit"}
                                                    showPreviews={false}
                                                    filesLimit={1}
                                                    showFileNamesInPreview={false}
                                                    maxFileSize={5000000}
                                                    open={true}
                                                    onChange={onFileChangeEvent}
                                                />
                                            </Col>
                                            {/* Place, time and type */}
                                            <Col className='col-6 px-0'>
                                                <Form.Group 
                                                        controlId="event_type" 
                                                        styles={{width:'300px', maxHeight:'500px'}} 
                                                    > 
                                                        <Select
                                                            placeholder='&nbsp; Tipoogia'
                                                            options={type}
                                                            onChange={handleChangeSelectType}
                                                            styles={customStyles}
                                                            theme={themes}
                                                        />
                                                </Form.Group> 
                                                <Form.Group 
                                                    controlId="event_place"
                                                    className="mt-3"
                                                > 
                                                    <Form.Control
                                                        placeholder="Indirizzo - (Provincia)"
                                                        style={{color:'var(--oxygen-white)', border:'0px', minHeight:'58px', borderRadius:'0px'}}
                                                        className='bg-dark'
                                                        type="name"
                                                    />
                                                </Form.Group>
                                                <Row>
                                                    <Col className="">
                                                        <Form.Group className="mt-3">
                                                            <DatePicker 
                                                                placeholderText="Data"
                                                                selected={startDate}
                                                                minDate={new Date()}
                                                                onChange={handleChangeDay}
                                                                showMonthDropdown
								dateFormat="dd/MM/yyyy"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col className="d-flex justify-content-end">
                                                        <Form.Group className="mt-3">
                                                            <DatePicker 
                                                                selected={startTime}
                                                                onChange={handleChangeTime}
                                                                placeholderText="Orario" 
                                                                locale={it}
                                                                timeFormat="p"
                                                                showTimeSelect
                                                                showTimeSelectOnly
                                                                timeIntervals={15}
                                                                timeCaption="Time"
                                                                dateFormat="HH:mm"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row> 
                                    </Tab>
                                    {/*
                                    ##################################
                                    Tabs for the releted post
                                    ##################################
                                    */}
                                    <Tab 
                                        eventKey="post" 
                                        title="&#xf0e0; &nbsp; Post"
                                        className="m-4"
                                    >
                                        {/* Title of the post */} 
                                        <Row className=''>
                                            <Form.Group controlId="post_title"> 
                                                <Form.Control
                                                    name="post_title"
                                                    type="name"
                                                    className='bg-dark'
                                                    placeholder='Titolo'
                                                    style={{color:'var(--oxygen-white)', border:'0px',minHeight:'58px', borderRadius:'0px'}}
                                                />
                                            </Form.Group>
                                        </Row>
                                        {/* Text Editor for the conetnt of the post */}
                                        <Row className='mt-3'>
                                            <Editor 
                                                onEditorStateChange={onEditorChangeHandlerPost}
                                                editorState={editorStatePost}
                                                wrapperClassName="reply-form wrapper"
                                                editorClassName="post-form editor"
                                                toolbarClassName="reply-form toolbar"
                                                placeholder='Contenuto'
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
                                        {/* Info post */}
                                        <Row className='mt-3'>
                                            {/* Images of the post */}
                                            <Col className='col-6'>
                                                <div>
                                                    <DropzoneArea
                                                        name='post_files'
                                                        acceptedFiles={['image/*']}
                                                        cancelButtonText={"cancel"}
                                                        submitButtonText={"submit"}
                                                        showPreviews={false}
                                                        showFileNamesInPreview={false}
                                                        maxFileSize={5000000}
                                                        filesLimit={3}
                                                        onChange={onFileChangePost}
                                                        open={true}
                                                    />
                                                </div>
                                            </Col>
                                            {/* Tags of the post */}
                                            <div className='col-6 p-0'>
                                                <Form.Group controlId="tags" className='p-3 pt-0' name="tags" styles={{minHeight:'500px', height:'500px', overflow:'scroll'}}>
                                                    <Select
                                                        placeholder='&#xf02c; &nbsp; Tag'
                                                        options={tags}
                                                        onChange={handleChangeSelectTags}
                                                        isMulti
                                                        styles={customStyles}
                                                        theme={themes}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </Row>
                                    </Tab>
                                    {/*
                                    ##################################
                                    Tabs for the summary and confitm
                                    ##################################
                                    */}
                                    <Tab
                                        eventKey='summary'
                                        className="m-4"
                                        title=" &#xf1e0; &nbsp; Riepilogo"

                                    >
                                        <Row>
                                            {/* Summary evento */}
                                            <div className="col-6">
                                                <h5 className="mb-2">Evento</h5>
                                                <hr className="m-0"/>
                                                <div className="px-2 mt-3" style={{overflow:'scroll'}}>
                                                    <p style={{display:'inline', color:'var(--engine-grey)'}}>
                                                        Titolo: &nbsp;
                                                        <p style={{display:'inline', color:'white'}}>
                                                        {data.event_title}
                                                        </p><br/>
                                                    </p>
                                                    <p style={{display:'inline', color:'var(--engine-grey)'}}>
                                                        Descrizione: &nbsp;
                                                        <p style={{display:'inline', color:'white'}}>
                                                        {parser(data.event_description)}
                                                        </p><br/>
                                                    </p>
                                                    <p style={{display:'inline', color:'var(--engine-grey)'}}>
                                                        Tipologia: &nbsp;
                                                        <p style={{display:'inline', color:'white'}}>
                                                        {data.event_type}
                                                        </p><br/>
                                                    </p>
                                                    <p style={{display:'inline', color:'var(--engine-grey)'}}>
                                                        Luogo: &nbsp;
                                                        <p style={{display:'inline', color:'white'}}>
                                                        {data.event_place}
                                                        </p><br/>
                                                    </p>
                                                    <p style={{display:'inline', color:'var(--engine-grey)'}}>
                                                        Data e Ora: &nbsp;
                                                        <p style={{display:'inline', color:'white'}}>
                                                        {data.event_date + ' - ' + moment(data.event_time, 'hh:mm a').format('HH:mm')}
                                                        </p><br/>
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Summary post */}
                                            <div className="col-6">
                                                <h5 className="mb-2">Post</h5>
                                                <hr className="m-0"/>
                                                <div className="px-2 mt-3" style={{overflow:'auto'}}>
                                                    <p style={{display:'inline', color:'var(--engine-grey)'}}>
                                                        Titolo: &nbsp;
                                                        <p style={{display:'inline', color:'white'}}>
                                                        {data.post_title}
                                                        </p><br/>
                                                    </p>
                                                    <p style={{display:'inline', color:'var(--engine-grey)'}}>
                                                        Descrizione: &nbsp;
                                                        <p style={{display:'inline', color:'white'}}>
                                                        {parser(data.post_text)}
                                                        </p><br/>
                                                    </p>
                                                    <p style={{display:'inline', color:'var(--engine-grey)'}}>
                                                        Tags: &nbsp;
                                                        <p style={{display:'inline', color:'white'}}>
                                                        { (Array.isArray(data.post_tags_name) ? data.post_tags_name.map((x) => x  + ' / ') : '')}
                                                        </p><br/>
                                                    </p>
                                                </div>
                                            </div>
                                        </Row>
                                        <Row 
                                            className="d-flex justify-content-center align-items-center mt-5"
                                        >
                                            <div className="col-auto">
                                                <button className='btn btn-outline-primary mx-1' onClick={handleSubmit}> &#xf1e0; &nbsp; Pubblica</button>
                                                <button className='btn btn-outline-danger mx-1' onClick={handleSubmit}> &#xf00d; &nbsp; Annulla</button>
                                            </div>

                                        </Row>
                                    </Tab>
                                    {/*
                                    ##################################
                                    Tabs for the rules
                                    ##################################
                                    */}
                                    <Tab 
                                        eventKey="rules" 
                                        title=" &#xf02d; &nbsp; Regole"
                                    >
                                        <Row className="d-flex justify-content-center align-items-center px-4">
                                            <h5 className="mt-2" style={{textAlign:'center'}}>Regole per creare l'Evento</h5>
                                            <hr />
                                            <ul>
                                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
                                            </ul> 
                                        </Row>
                                    </Tab>
                                </Tabs>
                            </Form>
                        </Row>
                    </div>
                </Row>
            </Container>
            <ToastContainer></ToastContainer>
        </CupraTribe>
    );
}
