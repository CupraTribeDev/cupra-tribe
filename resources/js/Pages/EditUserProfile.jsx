import React from "react";
import { useForm } from '@inertiajs/inertia-react';
import CupraTribe from '@/Layouts/CupraTribe';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { DropzoneArea } from 'material-ui-dropzone';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import tribe from '../../img/assets/cupra-tribe.jpg'
import '../../css/bootstrap-overrides.css'
import '../../css/responsive.css'

export default function EditUserProfile({ user }) {

    const { data, setData, post, processing, errors } = useForm({
        first_name: user.first_name,
        last_name: user.last_name,
        birthday: user.birthday,
        biografia: user.bio,
        username: user.username,
        email: user.email,
        password: user.password,
        password_confirmation: user.password,
        files1: [],
        files2: [],
        genere: user.genere,
        auto: user.auto,
    });

    let bio = null;
    if (user.bio != null) {
        bio = user.bio;
    }
    else {
        bio = null;
    }

    let genere = null;
    if (user.genere != null) {
        genere = user.genere;
    }
    else {
        genere = "ND";
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
        e.preventDefault();
        post(route('api.user.update', { id: user._id }));
    }

    function onFileChange(e) {
        setData(values => ({
            ...values,
            files1: (Array.isArray(e) ? e.map((x) => x) : e[0]),
        }));
    }

    function onFileChangeCopertina(e) {
        setData(values => ({
            ...values,
            files2: (Array.isArray(e) ? e.map((x) => x) : e[0]),
        }));
    }

    return (
        <CupraTribe user={user}>
            <div className="container-lg p-2 rounded border bg-dark-cupra-petrol text-white">
                <Row className='cupra-overlay p-0 m-0 cover' style={{ backgroundImage: `url(${tribe})`, backgroundPosition: "center center", backgroundSize: "cover" }}></Row>
                <Row className="mx-3 mt-5"><h3>Modifica il tuo Profilo</h3></Row>
                <hr className="mx-3 my-1" />
                <Row>
                    <Form className="mt-3" onChange={onChangeHandler}>
                        <Row>
                            <Row className="m-0">
                            </Row>
                            <Col className="col-12 col-lg-6">
                                <Form.Group controlId="first_name" className="mx-5 my-3">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="name" defaultValue={user.first_name} placeholder="Inserisci il tuo nome"></Form.Control>
                                    <span style={{ color: '#C1935E' }}> {errors.first_name} </span>
                                </Form.Group>
                            </Col>
                            <Col className="col-12 col-lg-6">
                                <Form.Group controlId="last_name" className="mx-5 my-3">
                                    <Form.Label>Cognome</Form.Label>
                                    <Form.Control type="name" defaultValue={user.last_name} placeholder="Inserisci il tuo cognome" />
                                    <span style={{ color: '#C1935E' }}> {errors.last_name} </span>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="genere" className="mx-5 my-3">
                            <Form.Label>Genere</Form.Label>
                            <Form.Select aria-label="" defaultValue={genere}>
                                <option value="U">Uomo</option>
                                <option value="D">Donna</option>
                                <option value="ND">Preferisco non indicarlo</option>
                            </Form.Select>
                            <span style={{ color: '#C1935E' }}>{errors.genere} </span>
                        </Form.Group>
                        <Form.Group controlId="birthday" className="mx-5 my-3">
                            <Form.Label>Data di nascita</Form.Label>
                            <Form.Control type="date" defaultValue={user.birthday} placeholder="Inserisci la tua data di nascita" />
                            <span style={{ color: '#C1935E' }}>{errors.birthday} </span>
                        </Form.Group>
                        <Form.Group controlId="auto" className="mx-5 my-3">
                            <Form.Label>Vettura principale</Form.Label>
                            <Form.Control type="text" defaultValue={user.auto} placeholder="Inserisci il nome della tua vettura principale" />
                            <span style={{ color: '#C1935E' }}>{errors.auto} </span>
                        </Form.Group>
                        <Row>
                            <Col className="col-12 col-lg-9">
                                <Form.Group controlId="biografia" className="mx-5 my-3">
                                    <Form.Label>Biografia</Form.Label>
                                    <Form.Control
                                        name="text"
                                        className="cp-form dark"
                                        placeholder="Inserisci una tua biografia..."
                                        as="textarea"
                                        style={{ minHeight: "280px" }}
                                    >{bio}</Form.Control>
                                    <span style={{ color: '#C1935E' }}> {errors.biografia} </span>
                                </Form.Group>
                            </Col>
                            <Col className="col-12 col-lg-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                <div className="mx-5 my-3" style={{ justifySelf: "right" }}>
                                    <Form.Label>Foto profilo</Form.Label>
                                    <DropzoneArea
                                        name='file1'
                                        filesLimit='1'
                                        acceptedFiles={['image/*']}
                                        dropzoneText={"Trascina un'immagine oppure fai click"}
                                        color="black"
                                        cancelButtonText={"cancel"}
                                        submitButtonText={"submit"}
                                        maxFileSize={5000000}
                                        showPreviewsInDropzone={true}
                                        onChange={onFileChange}
                                    />
                                </div>
                            </Col>
                            {/* <Col className="col-12 col-lg-3" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                                <div className="mx-5 my-3" style={{justifySelf:"right"}}>
                                <Form.Label>Foto copertina</Form.Label>
                                <DropzoneArea
                                    name='file2'
                                    filesLimit='1'
                                    acceptedFiles={['image/*']}
                                    dropzoneText={"Trascina un'immagine oppure fai click"}
                                    color="black"
                                    cancelButtonText={"cancel"}
                                    submitButtonText={"submit"}
                                    maxFileSize={5000000}
                                    showPreviewsInDropzone={true}
                                    onChange={onFileChangeCopertina}  
                                />
                                </div>
                            </Col> */}
                        </Row>
                        <hr className="mx-5 my-4" />
                        <Form.Group controlId="email" className="mx-5 my-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" defaultValue={user.email} placeholder="Inserisci la tua email" />
                            <span style={{ color: '#C1935E' }}> {errors.email} </span>
                        </Form.Group>
                        <Form.Group controlId="password" className="mx-5 my-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Inserisci la tua nuova password" />
                            <span style={{ color: '#C1935E' }}> {errors.password} </span>
                        </Form.Group>
                        <Form.Group controlId="password_confirmation" className="mx-5 my-3">
                            <Form.Label>Conferma Password</Form.Label>
                            <Form.Control type="password" placeholder="Conferma la tua nuova password" />
                            <span style={{ color: '#C1935E' }}> {errors.password_confirmation} </span>
                            <Form.Text>
                                <br></br>
                                La password deve essere ben formata: <br></br>
                                almeno 8 caratteri, un carattere maiuscolo (da A a Z), un carattere numerico (da 0 a 9) e un carattere speciale (ad esempio !,$,#,%)
                            </Form.Text>
                        </Form.Group>
                        <hr className="mx-5 my-4" />
                        <Form.Group controlId="submit" className="mx-5 my-3">
                            <Col className="col col-button-submit">
                                <Button className="button-submit button primary my-4 me-4" href={route('viewuser', { username: user.username })} type="submit">Annulla</Button>
                                <Button className="end-button button-submit button primary my-4" onClick={handleSubmit} type="submit">Salva</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Row>
            </div>
        </CupraTribe>
    );
}