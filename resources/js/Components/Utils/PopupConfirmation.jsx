import React from 'react'
import { Modal, Button } from "react-bootstrap";
import Anchor from "@/Components/Utils/Anchor"
 

export default function PopupConfirmation({ showModal, hideModal, message, route, params}) {
    return (
        <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma</Modal.Title>
        </Modal.Header>
        <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
        <Modal.Footer>
          <Button variant="default" onClick={hideModal}>
            Annulla
          </Button>
          <Button variant="danger" onClick={hideModal}>
            <Anchor routeName={route} routeParams={{id : params}} method="post" children={"Elimina"}></Anchor>
          </Button>
        </Modal.Footer>
      </Modal>
    )
}