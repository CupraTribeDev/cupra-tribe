import React from "react";
import CupraTribe from '@/Layouts/CupraTribe';
import { Tab, Tabs, Row, Col, Container } from 'react-bootstrap';
import ReportList from "@/Components/Admin/ReportList";
import BanList from "@/Components/Admin/BanList";
import ContentHandler from "@/Components/Admin/ContentHandler";
import '../../css/responsive.css'

export default function Moderation(props) {

    return (
	<CupraTribe user={props.auth.user}>
	    <Container className="primary no-effect no-hover">
		<Tabs defaultActiveKey="moderazione" justify>
		    <Tab eventKey="moderazione" title="Moderazione">
			<h1 className="my-5 py-3" style={{textAlign:"center"}}> Moderazione </h1>
			<Col>
			    <Tabs
				defaultActiveKey="segnalazioni"
				id="justify-tab-example"
				className="mb-3"
				justify
				>
				<Tab eventKey="segnalazioni" title="Segnalazioni">
					<ReportList />
				</Tab>
				<Tab eventKey="ban" title="Ban">
					<BanList />
				</Tab>
			    </Tabs>
			</Col>
		    </Tab>
		    <Tab eventKey="contenuto" title="Contenuti">
			<ContentHandler/>
		    </Tab>
		</Tabs>
	    </Container>
	</CupraTribe>
    );
}
