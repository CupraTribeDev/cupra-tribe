import React, { useState, useEffect } from 'react';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import '../../../css/responsive.css'
import Report from './Report';


export default function ReportList() {

    let [reports, setReports] = useState([]);
    let [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    function refresh(){
        setReports([]);
        loadAllReports();
    }

    function ignoreReport(id, routeIgnora) {
        setReports(reports.filter(report => report._id != id))
        let requestParams = {
            id: id,
        }
        setLoading(true);
        axios.get(route(routeIgnora, requestParams))
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error(error.response.data);
            }).finally(() => { setLoading(false) });
    }

    function banReport(id, routeBan) {
        setReports(reports.filter(report => report._id != id))
        let requestParams = {
            id: id,
        }
        setLoading(true);
        axios.get(route(routeBan, requestParams))
            .then((response) => {
                console.log('ban', response);
            })
            .catch((error) => {
                console.error(error.response.data);
            }).finally(() => { setLoading(false) });
    }

    const loadAllReports = () => {
        //*************** axios call
        setLoading(true);
        axios.get(route("api.content.get.reports"))
            .then((response) => {
                const newReports = [];
                response.data.forEach((report) => newReports.push(report));
                setReports(newReports);
                // setHasMore(response.data.length == 0 ? false : true)
                console.log('all Reports', response.data);
            })
            .catch((error) => {
                console.error(error.response.data);
            }).finally(() => { setLoading(false) });
        //***************
    };

    function selectChangeHandler(event){
        setFilter(event.target.value);
    }


    const filterReports = () => {

        let filteredReports = reports.filter((item) => {
            if (item.info === filter) {
                return item;
            } else if (filter === 'all') {
                return item;
            }
        })
        return filteredReports;
    }

    useEffect(() => {
        loadAllReports();
    }, [])

    return (
        <div>

            <Row className='mt-5'>
                <Col className='col-12 col-lg-7' style={{ display: 'flex', verticalAlign: 'bottom', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <p className="mb-0 d-flex" >Post e commenti segnalati dagli utenti</p>
                </Col>
                <Col className="col-12 col-lg-5 col-button-submit">
                    <p className="mb-0 d-flex" style={{ display: 'flex', verticalAlign: 'bottom', flexDirection: 'column', justifyContent: 'flex-end' }}>{filterReports().length} segnalazioni totali</p>
                    <Form.Group controlId="filtro" className="mx-5">
                        <Form.Select aria-label="" defaultValue={filter} onChange={selectChangeHandler}>
                            <option value="post">Post</option>
                            <option value="comment">Commenti</option>
                            <option value="all">Tutti</option>
                        </Form.Select>
                    </Form.Group>
                    <Button onClick={refresh} variant="link" size="sm" ><FontAwesomeIcon icon={faRotateRight} size="lg"/></Button >
                </Col>
            </Row>
            <hr />
            {filterReports().map((report) => (
                <Report report={report} callback1={ignoreReport} callback2={banReport} />
            ))}
        </div>
    );

}
