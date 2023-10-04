import axios from "axios"; // Import the axios library for making HTTP requests.
import React, { useState, useEffect } from "react"; // Import React and its hooks.
import { Form, Button } from "react-bootstrap"; // Import components from React Bootstrap.
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook from React Router.
import getUserInfo from "../../utilities/decodeJwt"; // Import a utility function for decoding JWT tokens.
import { Link } from "react-router-dom"; // Import the Link component from React Router.




const CreatePost = () => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);

  const [user, setUser] = useState(null);
  const [postContent, setPostContent] = useState("");

  useEffect(() => {
    const currentUser = getUserInfo();
    setUser(currentUser);
  }, []);

  const navigate = useNavigate();

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleImageChange = (event) => {
    const newFiles = event.target.files;
    setImages((prevImages) => [...prevImages, ...newFiles]);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      return;
    }

    const post = {
      id: user.id,
      content: postContent,
      username: user.username,
    };

    try {
      const formData = new FormData();

      Array.from(images).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      formData.append("post", JSON.stringify(post));

      await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/create-post-with-multiple-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/getAllPost");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      {!user ? (
        <div>
          <h3>
            You are not authorized to view this page. Please{" "}
            <Link to={"/login"}>login here</Link>.
          </h3>
        </div>
      ) : (
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
          <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: "60%" }}>
            <Form.Control
              type="text"
              placeholder="What's on your mind?"
              name="content"
              value={postContent}
              onChange={handleChange}
              style={{ height: "3cm", width: "100%" }}
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
            <img
              src="/addVideo.png"
              alt="Add Video Icon"
              style={{ width: '60px', height: '60px', marginTop: '.5cm' }}
            />
            <input
              type="file"
              ref={inputRef}
              onChange={handleImageChange}
              multiple
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
      )}

      <Modal show={showImageModal} onHide={handleCloseImageModal}>
        <Modal.Header closeButton style={{ backgroundColor: "#007bff", color: "#fff" }}>
          <Modal.Title>Upload Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" ref={inputRef} onChange={handleImageChange} multiple />
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
          <Button variant="secondary" onClick={handleCloseImageModal}>
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
