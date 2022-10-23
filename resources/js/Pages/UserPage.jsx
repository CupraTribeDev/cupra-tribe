import React, { useState } from "react";
import CupraTribe from '@/Layouts/CupraTribe';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Avatar from '@/Components/User/Avatar';
import Anchor from "@/Components/Utils/Anchor"
import tribe from '../../img/assets/cupra-tribe.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faLevelUp, faEnvelope, faLock, faUnlockAlt, faUnlock, faPenToSquare, faTrashCan, faBan } from '@fortawesome/free-solid-svg-icons'
import UserPostsInfiniteScroll from "@/Components/Post/UserPostsInfiniteScroll";
import UserEvents from "@/Components/Event/UserEvents";
import UserActivities from "@/Components/User/UserActivities";
import '../../css/responsive.css'
import PopupConfirmation from "@/Components/Utils/PopupConfirmation";

export default function UserPage(props) {

	const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
	const [deleteMessage, setDeleteMessage] = useState(null);

	const showDeleteModal = () => {
		setDeleteMessage(`Sicuro di voler eliminare il tuo profilo? L'operazione non è reversibile`);
		setDisplayConfirmationModal(true);
	};

	const hideConfirmationModal = () => {
		setDisplayConfirmationModal(false);
	};

	let ban= null;

	if( props.auth.user &&
	    props.auth.user.role=='admin' &&
	    (props.auth.user.username != props.user.username) &&
	    (props.user.role!='admin'))
	{
		ban= <Button className="ps-0" size="lg" variant="link">
				<Anchor routeName={"api.ban.user"} routeParams={{
					id: props.user._id
				}} children={<FontAwesomeIcon style={{ marginBottom: "8px" }} icon={faBan} />}></Anchor>
		</Button>
	}

	let edit = null;
	if (props.auth.user &&
	    (props.auth.user.username == props.user.username)) {
		edit = <div class="d-flex">

			<Button className="ms-0" size="lg" variant="link">
				<Anchor routeName={"api.user.edit"} routeParams={{
					id: props.user._id
				}} children={<FontAwesomeIcon style={{ marginBottom: "8px" }} icon={faPenToSquare} />}></Anchor>
			</Button>
			<Button className="" size="lg" variant="link" style={{ color: "#003e51" }}>
				<FontAwesomeIcon style={{ marginBottom: "8px" }} icon={faTrashCan} onClick={() => showDeleteModal()} />
			</Button>
		</div>
	}
	else {
		edit = null;
	}

	let bio = null;
	if (props.user.bio != null) {
		bio = <div>
			<h3>Biografia</h3>
			<hr />
			<Col>
				<p>{props.user.bio}</p>
			</Col>
		</div>

	}
	else {
		bio = null;
	}

	let role = null;
	if (props.user.role == "admin") {
		role = <p>Ruolo: <FontAwesomeIcon icon={faUnlock} style={{ marginLeft: "1rem" }} /> {props.user.role}</p>
	}
	else if (props.user.role == "moderator") {
		role = <p>Ruolo: <FontAwesomeIcon icon={faUnlockAlt} style={{ marginLeft: "1rem" }} /> {props.user.role}</p>

	} else {
		role = <p>Ruolo: <FontAwesomeIcon icon={faLock} style={{ marginLeft: "1rem" }} /> {props.user.role}</p>
	}

	let genere = 'Non indicato'
	if (props.user.genere == 'U') {
		genere = 'Uomo';
	}
	if (props.user.genere == 'D') {
		genere = 'Donna';
	}

	let path = '/storage/user/'+props.user.username+'/'+props.user.username+'-C.jpg'

	return (
		<CupraTribe user={props.auth.user}>
			<div className="container-lg p-2 rounded border bg-dark-cupra-petrol text-white">
				{/* <Row className='cupra-overlay p-0 m-0 cover' style={{ backgroundImage: `url(${path})`, backgroundPosition: "center center", backgroundSize: "cover" }}></Row> */}
				<Row className='cupra-overlay p-0 m-0 cover' style={{ backgroundImage: `url(${tribe})`, backgroundPosition: "center center", backgroundSize: "cover" }}></Row>
				<Row>
					<Col className="col-8 col-md-10">
						<Anchor className="d-flex"
							routeName='viewuser'
							routeParams={{
								username: props.user.username
							}}>
							<div className="avatar-profile m-3">
								<Avatar user={props.user.username} />
							</div>
							<div className="px-1 p-3 d-flex align-items-center justify-content-center" style={{ verticalAlign: "middle" }}>
								<h2>{props.user.username}</h2>
							</div>
						</Anchor>
					</Col>
					<Col className="col-3 col-md-2 ps-0" style={{ display: 'flex', verticalAlign: 'middle' }}>
						{edit}
						{ban}
					</Col>
				</Row>
				<Row className="mx-5 my-4">
					<Col className="col-10 mb-0 px-2" style={{ display: "flex" }}>
						<h3 style={{ alignSelf: "flex-end" }}>Informazioni utente</h3>
					</Col>
					<hr />
					<Col className="col-12 col-md-6">
						<p>Nome: {props.user.first_name}</p>
						<p>Cognome: {props.user.last_name} </p>
						<p>Genere: {genere} </p>
						<p>Data di nascita: <FontAwesomeIcon icon={faCalendar} style={{ marginLeft: "1rem" }} /> {new Date(props.user.birthday).toDateString()}</p>
						<p>Email: <FontAwesomeIcon icon={faEnvelope} style={{ marginLeft: "1rem" }} /> {props.user.email}</p>
					</Col>
					<Col className="col-12 col-md-6">
						<p>Membro Tribe dal: <FontAwesomeIcon icon={faCalendar} style={{ marginLeft: "1rem" }} /> {new Date(props.user.created_at).toDateString()} </p>
						<p>Guido una: {props.user.auto}</p>
						{role}
						<p>Esperienza accumulata: <FontAwesomeIcon icon={faLevelUp} style={{ marginLeft: "1rem" }} /> {props.user.exp} XP</p>
					</Col>
				</Row>
				<Row className="mx-5 my-5">
					{bio}
				</Row>
				<Row className="mx-5 my-5">
					<h3> Posts, eventi e attività recenti di {props.user.username}</h3>
					<hr />
					<Col>
						<Tabs
							defaultActiveKey="posts"
							id="justify-tab-example"
							className="mb-3"
							justify
						>
							<Tab eventKey="posts" title="Posts">
								<p className="mt-5">Post pubblicati da {props.user.username}</p>
								<hr />
								<UserPostsInfiniteScroll user={props.user.username} />
							</Tab>
							<Tab eventKey="events" title="Eventi">
								<Row className="m-0 p-0 my-5">
									<Col className="col-6 m-0 p-1">
										<p>Eventi a cui {props.user.username} ha partecipato</p>
										<hr />
										<Container style={{ display: "flex" }} className="m-0 p-0 justify-content-center">
											<UserEvents id={props.user._id} owner={false} />
										</Container>
									</Col>
									<Col className="col-6 m-0 p-1">
										<p>Eventi che {props.user.username} ha creato</p>
										<hr />
										<Container style={{ display: "flex" }} className="m-0 p-0 justify-content-center">
											<UserEvents id={props.user._id} owner={true} />
										</Container>
									</Col>
								</Row>
							</Tab>
							<Tab eventKey="activity" title="Attività">
								<p className="mt-5">I post pubblicati, consigliati e commentati da {props.user.username} nell'ultima settimana</p>
								<hr />
								<UserActivities user={props.user} />
							</Tab>
						</Tabs>
					</Col>
				</Row>
				<PopupConfirmation showModal={displayConfirmationModal} hideModal={hideConfirmationModal} message={deleteMessage} route={"api.user.destroy"} params={props.user.username} />
			</div>
		</CupraTribe>
	);
}
