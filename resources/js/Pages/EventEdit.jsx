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
import { convertToRaw, EditorState, ContentState, convertFromHTML } from 'draft-js';
import parser from 'html-react-parser';
/* import for bootstrap */
import { ProgressBar, Button, Container, Col, Row, Form, Tabs, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarCheck, faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
/* import for toast notification */
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from "moment/min/moment-with-locales";
import it from "date-fns/locale/it";

export default function EventEdit(props){
    moment.locale('it')

    // method to retrieve the api token
    const [apiToken, setToken] = useState(false);
    async function getApi() {
    }
    /* 
    ###################################################################################################
    Form Handler and Errors
    ######################################################################################################
    */
    const [tags, setTags] = useState([]);
    const [type, setType] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedType, setSelectedType] = useState([]);
    const [name, setName] = useState([]);

    const { data, setData, put, processing, errors } = useForm({
        /* event */
        event_title: props.event.title,
        event_description: props.event.description,
        event_place: props.event.place,
        event_time : props.event.time,
        event_type: props.event.type,
        event_date: props.event.from_date,
        /* post */
        post_title: props.post.title,
        post_text: props.post.text,
        post_tags: props.post.tags,
        post_tags_name: name, 
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
        console.log(props.post.tags)
    }
    function handleSubmit(e) {
        e.preventDefault();
        e.target.disabled = true;
        put(route('edit.event', {id: props.event._id}), {
            onSuccess: (res) => {
                new swal({
                    title:'Success', 
                    text:'Evento modificato con successo!',
                    icon: 'success',
                    buttons: {
                        confirm : {text:'Conferma', className: 'swal-confirm'},
                    },
                }).then( () => {
                    window.location = route('home');
                })
            }
        });
    }
    /*
    ##################################################################################
    Text Editor
    ##################################################################################
    */
    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(data.event_description)))
    );
    function onEditorChangeHandler(e) {
        setEditorState(e);
        setData(values =>({
          ...values,
          "event_description": draftToHtml(convertToRaw(e.getCurrentContent()))
      }));
    
    }
    const [editorStatePost, setEditorStatePost] = useState(() =>
        EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(data.post_text)))
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
        setSelectedTags(e)
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
        setSelectedType(e)
        setData(values => ({
            ...values,
            event_type: e.label,
        }));
    };
    useEffect(()=>{
        if(!apiToken) getApi();
        let t = [];
        axios.get(route("api.content.tags")).then((response) => {
            t = response.data;
            let tagsarray =[]
            t.forEach(tag => { tagsarray.push({ value: tag._id, label: tag.name}) });
            setTags(tagsarray);
            let select = []
            let name = []
            tagsarray.find(element => {
                if(element.value == props.post.tags[0]){
                    select.push(element)
                    name.push(element.label)
                }
                if(element.value == props.post.tags[1]){
                    select.push(element)
                    name.push(element.label)
                }
                if(element.value == props.post.tags[2]){
                    select.push(element)
                    name.push(element.label)
                }
            })
            setSelectedTags(select)
            setName(name);
            setData(values => ({
                ...values,
                post_tags_name: (Array.isArray(name) ? name.map((x) => x) : []),
            }));
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
            let select = []
            tagsarray.find(element => {
                if(element.label == props.event.type){
                    select.push(element)
                }
            })
            setSelectedType(select)


        })
        .catch((error) => { console.log(error); });
    }, []);
    /*
    #################################################################################
    DatePicker
    #################################################################################
    */
    const [startTime, setStartTime] = useState(() => {
        let date = String(props.event.from_date).split('-');
        let time = props.event.time.split(':')
        return new Date(Number(date[0]), Number(date[1]), Number(date[2]), time[0], time[1])
    });
    const [startDate, setStartDate] = useState((new Date(data.event_date)));
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

    return(
        <CupraTribe user={props.auth.user} title="Homepage">
            {/* Name of the Page - Create Event */}
            <Container>
                <Row className="d-flex">
                    <h1 className="oxygen-white m-2 px-3"><FontAwesomeIcon icon={faCalendarCheck}  /> Modifica Evento</h1>
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
                                                        defaultValue={data.event_title}
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
                                            {/* Place, time and type */}
                                            <Col className='col-3'>
                                                <Form.Group 
                                                        controlId="event_type" 
                                                        styles={{width:'300px', maxHeight:'500px'}} 
                                                    > 
                                                        <Select
                                                            placeholder='&nbsp; Tipoogia'
                                                            options={type}
                                                            value={selectedType}
                                                            onChange={handleChangeSelectType}
                                                            styles={customStyles}
                                                            theme={themes}
                                                        />
                                                </Form.Group>
                                            </Col>
                                            <Col className="col-4">
                                                <Form.Group 
                                                    controlId="event_place"
                                                > 
                                                    <Form.Control
                                                        placeholder="Indirizzo - (Provincia)"
                                                        style={{color:'var(--oxygen-white)', border:'0px', minHeight:'58px', borderRadius:'0px'}}
                                                        className='bg-dark'
                                                        type="name"
                                                        defaultValue={data.event_place}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col className="col-3">
                                                <Form.Group className="">
                                                    <DatePicker 
                                                        placeholderText="Data"
                                                        selected={startDate}
                                                        minDate={new Date()}
                                                        onChange={handleChangeDay}
                                                        showMonthDropdown
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col className="d-flex col-2 justify-content-end">
                                                <Form.Group className="">
                                                    <DatePicker 
                                                        onChange={handleChangeTime}
                                                        placeholderText="Orario" 
                                                        showTimeSelect
                                                        locale={it}
                                                        selected={startTime}
                                                        showTimeSelectOnly
                                                        timeIntervals={15}
                                                        timeCaption="Time"
                                                        dateFormat="HH:mm"
                                                    />
                                                </Form.Group>
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
                                                    defaultValue={data.post_title}
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
                                            {/* Tags of the post */}
                                            <div className='col-6 p-0'>
                                                <Form.Group controlId="tags" className='p-3 pt-0' name="tags" styles={{minHeight:'500px', height:'500px', overflow:'scroll'}}>
                                                    {selectedTags !== undefined && (
                                                        <Select
                                                            placeholder='&#xf02c; &nbsp; Tag'
                                                            options={tags}
                                                            value={selectedTags}
                                                            onChange={handleChangeSelectTags}
                                                            isMulti
                                                            styles={customStyles}
                                                            theme={themes}
                                                        />
                                                    )}
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
                                                        {data.event_date + ' - ' + data.event_time}
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

    )

}