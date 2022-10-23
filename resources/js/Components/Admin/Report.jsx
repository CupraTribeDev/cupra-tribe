import React from "react";
import Anchor from "@/Components/Utils/Anchor"
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCircle } from '@fortawesome/free-solid-svg-icons'
import '../../../css/responsive.css'

export default function Report({ report, callback1, callback2 }) {

    let message = "";
    let params = null;
    let routeBan = "";
    let routeIgnora = "";
    if (report.info == 'post') {
        message = 'Il post di ' + report.posted_by_username + ' è stato segnalato ' + report.report.length + ' volte';
        params = report._id;
        routeBan = "api.ban.post";
        routeIgnora = "api.content.ignore.post.reports";
    }
    else if (report.info == 'comment') {
        message = 'Il commento di ' + report.commented_by_username + ' è stato segnalato ' + report.report.length + ' volte'
        params = report.parent_post;
        routeBan = "api.ban.comment";
        routeIgnora = "api.content.ignore.comment.reports";
    }
    else {
        return null;
    }

    return (
        <div className="card primary post py-2 my-2">
            <Row>
                <Col className="col-12 col-lg-6 ps-4">
                    <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faCircle} size="xs" /> {message}
                </Col>
                <Col className="col-12 col-lg-6 col-button-submit">
                    <Button variant="link">
                        <Anchor
			    routeName={'viewpost'}
			    routeParams={{
				id: params
			    }}
			> 
			    <FontAwesomeIcon
				style={{ marginRight: "8px" }}
				icon={faEye}
				size="lg"
			    />
			</Anchor>
                    </Button >
                    <Button className="button secondary button-report" onClick={() => callback1(report._id, routeIgnora)}>
                        Ignora
                    </Button>
                    <Button className="button button-report" variant="danger" onClick={() => callback2(report._id, routeBan)}>
                        Banna
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
