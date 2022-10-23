import React from "react";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../../css/responsive.css'
import moment from "moment/min/moment-with-locales";

export default function Ban({ ban, callback }) {
    moment.locale('it');

    let message = "";
    let route = "";
    if (ban.info == 'post') {
        message = 'Post di ' + ban.posted_by_username + ', bannato ' + moment(ban.updated_at).fromNow()
        route = "api.unban.post";
    }
    else if (ban.info == 'comment') {
        message = 'Commento di ' + ban.commented_by_username + ', bannato ' + moment(ban.updated_at).fromNow()
        route = "api.unban.comment";
    }
    else if (ban.info == 'user') {
        message = 'Utente ' + ban.username + ' bannato ' + moment(ban.updated_at).fromNow()
        route = "api.unban.user";
    }

    return (
        <div className="card primary post py-2 my-2">
            <Row>
                <Col className="col-12 col-md-6 ps-4">
                    <FontAwesomeIcon style={{ marginRight: "8px" }} icon={faCircle} size="xs" /> {message}
                </Col>
                <Col className="col-12 col-md-6 col-button-submit">
                    <Button className="button-report" variant="success" onClick={() => callback(ban._id, route)}>
                        Annulla ban
                    </Button>
                </Col>
            </Row>
        </div>
    );
}