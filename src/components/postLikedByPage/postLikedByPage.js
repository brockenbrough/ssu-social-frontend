import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import api, { postURL } from './api/api';
import Modal from 'react-bootstrap/Modal';

function PostLikedByPage() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        likes
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Liked by</Modal.Title>
        </Modal.Header>
        <Modal.Body>users who liked this post</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PostLikedByPage 