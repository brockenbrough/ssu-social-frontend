import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { Link } from "react-router-dom";
import {useDarkMode } from '../DarkModeContext';
import UploadImages from "../images/uploadImages";


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

  //State for TextArea
  const handleTextChange = (e) => {
    setTextAreaCount(e.target.value.length);  //used for char counting
    if (textAreaCount == maxText - 1 || textAreaCount == maxText) {
      setColor('red');
    }
    else if (textAreaCount / maxText >= .75) {
      setColor('gold');
    }
    else {
      setColor('gainsboro')
    }
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

    //Dark Mode components.
    const { darkMode } = useDarkMode();
    const [textAreaCount, setTextAreaCount] = React.useState(0);
    const maxText = 280;
    var [color, setColor] = React.useState('gainsboro');
    const containerStyle = {
      background: darkMode ? 'black' : 'white',
      color: darkMode ? 'white' : 'black',
      // Add other styles here
    };

  // Modal UseStates
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const inputRefModal = useRef(null);


  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleImageChange = (event) => {
    const newFiles = event.target.files;
    setImages((prevImages) => [...prevImages, ...newFiles]); //Choose Multiple files
    setShowModal(true);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', e.target.elements.image.files[0]);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/create`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.msg);
      } else {
        alert('Image was not saved. HTTP status code: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!user) {
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
      <div className="App">

        <Form id="createPostID"
          onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              backgroundColor: "#f6f8fa",
              backgroundColor: darkMode ? "#000" : "#f6f8fa", // Change background color
              color: darkMode ? "#fff" : "#000",
            }}>
          <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: "60%" }}>
            <Form.Control as="textarea" maxlength="280" placeholder="What's on your mind?" name="content" value={state.content}
             onChange={handleTextChange}
              style={{ height: "3cm", width: "100%", backgroundColor: darkMode ? "#181818" : "white", color: darkMode ? "white" : "#000" }} />
            <p><span style={{ color: color }} onChange={handleTextChange}> {`${textAreaCount}/${maxText}`} </span></p>
          </Form.Group>

          <div name="img-icon" onClick={handleImageClick} style={{ display: "flex", justifyContent: "space-between", width: "60%" }} >
            <img
              src={darkMode ? "/addImageLight.png" : "/add-img-icon.png"}
              alt="Add Image Icon"
              style={{ width: "60px", height: "60px", marginTop: ".5cm" }}
            />
            <img src={darkMode ? "/addVideoWhite.png" : "/addVideo.png"} alt="Add Video Icon" style={{ width: '60px', height: '60px', marginTop: '.5cm' }} />

            
            <input //Let's the user choose file.
              type="file"
              ref={inputRef}
              onChange={handleImageChange}
              multiple // Allow multiple file selection
              style={{ display: "none" }}
            />
          </div>

          <Button style={{ width: "8cm", marginTop: "1cm", backgroundColor: "#28a745", borderColor: "#28a745" }} variant="primary" type="submit" size="lg" >
            Create Post
          </Button> 
        </Form>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton style={{ background: darkMode ? '#181818' : 'white', color: darkMode ? 'white' : 'black' }}>
            <Modal.Title>Upload Images</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: darkMode ? '#181818' : 'white', color: darkMode ? 'white' : 'black' }}>
            <UploadImages ref={inputRefModal} handleImageSubmit={handleImageSubmit} />
          </Modal.Body>
          <button onClick={handleCloseModal} type='button' style={{ flex: 0.5, backgroundColor: '#4caf50', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
        </Modal>

      </div>
    </>
  );
};
export default CreatePost;