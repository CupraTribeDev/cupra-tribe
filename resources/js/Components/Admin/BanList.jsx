import React, { useState, useEffect } from 'react';
import axios from "axios";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'

import Ban from './Ban';

export default function BanList() {

    const [bans, setBans] = useState([]);
    // Indica se stiamo caricando dei dati attraverso chiamata api (axios)
    const [loading, setLoading] = useState(true);
    let [filter, setFilter] = useState('all');

    function refresh(){
        setBans([]);
        loadAllBans();
    }

    function cancelBan(id, routeUnban) {
        setBans(bans.filter(ban => ban._id != id))
        let requestParams = {
            id: id,
        }
        setLoading(true);
        axios.get(route(routeUnban, requestParams))
            .then((response) => {
                console.log('ban', response);
            })
            .catch((error) => {
                console.error(error.response.data);
            }).finally(() => { setLoading(false) });
    }

    const loadAllBans = () => {
        //*************** axios call
        setLoading(true);
        axios.get(route("api.content.get.bans"))
            .then((response) => {
                const newBans = [];
                response.data.forEach((ban) => newBans.push(ban));
                setBans(oldBans => [...oldBans, ...newBans]);
                setHasMore(response.data.length == 0 ? false : true)
                console.log('data', response.data);
            })
            .catch((error) => {
                console.error(error.response.data);
            }).finally(() => { setLoading(false) });
        //***************
    };

    function selectChangeHandler(event) {
        setFilter(event.target.value);
    }

    const filterBans = () => {
        let filteredBans = bans.filter((item) => {
            if (item.info === filter) {
                return item;
            } else if (filter === 'all') {
                return item;
            }
        })
        return filteredBans;
    }

    useEffect(() => {
        loadAllBans();
    }, [])

    return (
        <div>

            <Row className='mt-5'>
                <Col className='col-6' style={{ display: 'flex', verticalAlign: 'bottom', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <p className="mb-0 d-flex" >Post e commenti segnalati dagli utenti</p>
                </Col>
                <Col className="col-6 col-button-submit">
                    <p className="mb-0 d-flex" style={{ display: 'flex', verticalAlign: 'bottom', flexDirection: 'column', justifyContent: 'flex-end' }}>{filterBans().length} ban totali</p>
                    <Form.Group controlId="filtro" className="mx-5">
                        <Form.Select aria-label="" defaultValue={filter} onChange={selectChangeHandler}>
                            <option value="post">Post</option>
                            <option value="comment">Commenti</option>
                            <option value="user">Utenti</option>
                            <option value="all">Tutti</option>
                        </Form.Select>
                    </Form.Group>
                    <Button onClick={refresh} variant="link" size="sm" ><FontAwesomeIcon icon={faRotateRight} size="lg"/></Button >
                </Col>
            </Row>

            <hr />
            {filterBans().map((ban) => (
                <Ban ban={ban} callback={cancelBan} />
            ))}
        </div>
    );

}