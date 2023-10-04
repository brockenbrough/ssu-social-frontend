import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { Link } from "react-router-dom";

const CreatePost = () => {

  // User UseStates
  const [user, setUser] = useState(null);
  const [state, setState] = useState({
    content: "",
  });
  useEffect(() => {
    const currentUser = getUserInfo();
    setUser(currentUser);

  }, []);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { content, username } = state;
    const post = {
      id: user.id,
      content,
      username: user.username,
    };
    await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`, post);
    navigate("/getAllPost");
  };

  // Modal UseStates
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    // Open the modal when the image is clicked
    setShowModal(true);
  };

  const handleImageChange = (event) => {
    const newFiles = event.target.files;

    // Update the image state by appending newly selected files
    setImages((prevImages) => [...prevImages, ...newFiles]);

    // Keep the modal open to allow selecting more files
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Close the modal without selecting an image
    setShowModal(false);
  };


  if (!user) {
    // If there is no user (not authorized), render a message and a link to login.
    return (
      <div>
        <h3>
          You are not authorized to view this page, Please Login in{" "}
          <Link to={"/login"}>
            <a href="#">here</a>
          </Link>
        </h3>
      </div>
    );
  }

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f6f8fa",
        }}
      >
        <Form.Group
          className="mb-3"
          controlId="formBasicPassword"
          style={{ width: "60%" }}
        >
          <Form.Control
            type="text"
            placeholder="What's on your mind?"
            name="content"
            value={state.content}
            onChange={handleChange}
            style={{
              height: "3cm",
              width: "100%",
            }}
          />
        </Form.Group>

        <div
          name="img-icon"
          onClick={handleImageClick}
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "60%",
          }}
        >
          <img
            src="/add-img-icon.png"
            alt="Add Image Icon"
            style={{ width: "60px", height: "60px", marginTop: ".5cm" }}
          />
          <img src="/addVideo.png" alt="Add Video Icon" style={{ width: '60px', height: '60px', marginTop: '.5cm' }} />

          {/* Add other icons as needed */}
          <input
            type="file"
            ref={inputRef}
            onChange={handleImageChange}
            multiple // Allow multiple file selection
            style={{ display: "none" }}
          />
        </div>

        <Button
          style={{
            width: "8cm",
            marginTop: "1cm",
            backgroundColor: "#28a745",
            borderColor: "#28a745",
          }}
          variant="primary"
          type="submit"
          size="lg"
        >
          Create Post
        </Button>
      </Form>

      {/* Modal for uploading images */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton style={{ backgroundColor: "#007bff", color: "#fff" }}>
          <Modal.Title>Upload Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Input for selecting multiple images */}
          <input
            type="file"
            ref={inputRef}
            onChange={handleImageChange}
            multiple
          />
          {images.length > 0 && (
            <div>
              <p>Selected Images:</p>
              <ul>
                {images.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#f6f8fa" }}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleImageChange}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default CreatePost;