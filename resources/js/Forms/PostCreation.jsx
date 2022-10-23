import React, { useEffect, useState } from 'react';
/* our component */

/* import for Bootstrap */
import { Form, Row, Col, Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons';
/* import for form */
import { useForm } from '@inertiajs/inertia-react';
import { DropzoneArea} from 'material-ui-dropzone';
import Select from 'react-select';
/* import for text editor*/
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState } from 'draft-js';
/* import for toast notification */
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert2';

/* 
###################################################################################################
To-Do
######################################################################################################
[x] Editor e TextBox vanno in conflitto, il text editor causa troppo ricorsione quando settiamo i dati
[x] Modificare lo stile della dropzone, vedere come sovrascrivere la min-height dello stile
[x] se non si riesce a ridurre la dimensione della dropzone mettere il bottone e la dialog
[x] sistemare la visualizzazione del contenuto del post
*/

export default function PostCreation({ user = null, className = null }) {

  const [apiToken, setToken] = useState(false);
  const [tags, setTags] = useState([]);
  const [events, setEvents] = useState([]);
  // to make the editor a controlled component
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  //hook per tenere traccia dello stato della form
  const { data, setData, post, processing, errors } = useForm({
      title: "",
      text: "",
      event: "",
      files: [],
      tags: [],
  });

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

  /* 
  ###################################################################################################
  Handler dei componenti della Form
  ######################################################################################################
  */
  function handleChangeSelectEvents(e){
      setData(values => ({
          ...values,
          event: e.value,
      }));
  };

  function handleChangeSelect(e){
    setData(values => ({
        ...values,
        tags: (Array.isArray(e) ? e.map((x) => x.value) : []),
    }));
  };

  function onFileChange(e){
      setData(values => ({
          ...values,
          files: (Array.isArray(e) ? e.map((x) => x) : e[0]),
      }));
  } 

  function onChangeHandler(e) {
      const key = e.target.id;
      const value = e.target.value
      setData(values => ({
          ...values,
          [key]: value,
      }));
  }

  function handleSubmit(e) { 
    e.target.disabled = true;
    e.preventDefault();
    post(route('api.content.post.new'), {
      onSuccess: (res) => {
        new swal({
          title:'Success', 
          text:'Post creato con successo!',
          icon: 'success'}).then( () => {
          window.location = route('home');
        })
      },
      onError: () => {
	e.target.disabled = false;
      }

    })
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
  Hook for the select
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

  // API call to retrive Event in which the user has partecipated
  useEffect(()=>{
      if(!apiToken) getApi();
      var t = [];
      axios.get(route("api.content.get.events")).then((response) => {
          t = response.data;
          var events =[]
          t.forEach(event => { events.push({ value: event._id, label: event.title}) });
          setEvents(events);
      })
      .catch((error) => { console.log(error); });
  }, []);

  // API call to retrive tags
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

  /* 
  ###################################################################################################
  Components Code
  ######################################################################################################
  - FormControl adds some additional styles for general appearance, focus state, sizing, and more.
  - FormFloating Wrap a <Form.Control> to enable floating label on the input field
  */
  return(
      <Form onChange={onChangeHandler} className={className}>
      {/* Input Text per il Titolo del Post */}
      <Row className='m-3'>
          <Form.Group controlId="title"> 
              <Form.Control
                controlId="title"
                name="title"
                type="name"
                className='bg-dark'
                placeholder='Titolo'
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
      {/* Select for tags and files */}
      <Row className='m-4'>
          <div className='col-6 p-0'>
            <Form.Group controlId="tags" className='p-2 pt-0' name="tags" styles={{minHeight:'500px', height:'500px', overflow:'scroll'}}>
                <Select
                  placeholder='&#xf02c; &nbsp; Tag'
                  options={tags}
                  onChange={handleChangeSelect}
                  isMulti
                  styles={customStyles}
                  theme={themes}
                />
            </Form.Group>
            <Form.Group className="p-2 pt-3" controlId="event" name="event" styles={{height:'58px'}}>
                <Select
                  placeholder='&#xf133; &nbsp; Evento'
                  options={events}
                  onChange={handleChangeSelectEvents}
                  styles={customStyles}
                />
            </Form.Group>
            {/* Button for confirm and annulla */}
            <div className="flex items-center d-flex justify-content-start pt-4">
              <button className='btn btn-outline-success mx-1' onClick={handleSubmit}>Pubblica</button>
              <button className='btn btn-outline-warning mx-1' onClick={()=> {history.back()}}>Annulla</button>
            </div>
          </div>
          <Col className='col-6'>
            <div>
              <DropzoneArea
                name='file'
                acceptedFiles={['image/*']}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                showPreviews={false}
                showFileNamesInPreview={false}
                maxFileSize={5000000}
                filesLimit={3}
                open={true}
                onChange={onFileChange}
              />
            </div>
          </Col>
      </Row>
      <ToastContainer></ToastContainer>
  </Form>
  );

}
