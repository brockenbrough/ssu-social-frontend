import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwtAsync";
import { useDarkMode } from "../DarkModeContext";

const CreatePostModal = ({ showModal, setShowModal }) => {
  const MAX_DESCRIPTION_CHAR = 280;
  const GREY_COLOR = "gainsboro";
  const GOLD_COLOR = "gold";
  const RED_COLOR = "red";

  const [user, setUser] = useState(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [charCountColor, setCharCountColor] = useState(GREY_COLOR);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const handleClose = () => setShowModal(false);

  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfoAsync();
      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const updateCharCountColor = (textLength) => {
    if (textLength === MAX_DESCRIPTION_CHAR) {
      setCharCountColor(RED_COLOR);
    } else if (textLength / MAX_DESCRIPTION_CHAR >= 0.75) {
      setCharCountColor(GOLD_COLOR);
    } else {
      setCharCountColor(GREY_COLOR);
    }
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setDescription(inputText);
    updateCharCountColor(inputText.length);
  };

  const handleImageClick = () => {
    document.getElementById("image").click();
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImage(image);

    if (e.target.files && image) {
      let reader = new FileReader();

      reader.onload = (event) => {
        const imgPreview = event.target.result;
        document.getElementById("imagePreview").src = imgPreview;
      };

      reader.readAsDataURL(image);
    }
  };

  const handleEmptyDescription = () => {
    alert("You need a description in order to create this post.");
  };

  const saveImageAndGetImageId = async () => {
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/images/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.imageId;
      } else {
        alert("Image was not saved. HTTP status code: " + response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    return null;
  };

  const savePost = async (post) => {
    try {
      post = {
        ...post,
        id: user.id,
        content: description,
        username: user.username,
      };
      await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`,
        post
      );

      return true;
    } catch (error) {
      console.error("Error creating post:", error);
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let post = {};

    if (!description.trim()) {
      handleEmptyDescription();
      return;
    }

    if (image) {
      const imageId = await saveImageAndGetImageId();
      if (imageId) {
        post = {
          ...post,
          imageId: imageId,
        };
      }
    }

    const success = savePost(post);
    if (success) {
      navigate("/getAllPost");
      handleClose();
    }
  };

  if (!user) {
    return (
      <div>
        <h3>
          You are not logged in. Please log in <Link to="/">here</Link>.
        </h3>
      </div>
    );
  }

  return (
    <div className="App">
      <Modal show={showModal} onHide={handleClose} centered>
        <div
          className="Popup"
          style={{
            backgroundColor: darkMode ? "#181818" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <Modal.Header closeButton closeVariant={darkMode ? "white" : "black"}>
            <Modal.Title>Create Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id="createPostID" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  as="textarea"
                  maxLength={MAX_DESCRIPTION_CHAR}
                  placeholder="What's on your mind?"
                  name="content"
                  value={description}
                  onChange={handleTextChange}
                  style={{
                    height: "150px",
                    padding: "10px",
                    borderRadius: "5px",
                    border: `1px solid ${darkMode ? "#333" : "#ccc"}`,
                    backgroundColor: darkMode ? "#181818" : "#fff",
                    color: darkMode ? "#fff" : "#000",
                    fontSize: "16px",
                  }}
                />
                <p
                  style={{
                    color: charCountColor,
                    fontSize: "14px",
                    marginTop: "5px",
                  }}
                >
                  {description.length}/{MAX_DESCRIPTION_CHAR}
                </p>
              </Form.Group>

              <div
                name="img-icon"
                onClick={handleImageClick}
                style={{ marginBottom: "15px" }}
              >
                <img
                  src={darkMode ? "/addImageLight.png" : "/add-img-icon.png"}
                  alt="Add Image Icon"
                  style={{
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                  }}
                />
              </div>

              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {image && (
                <div style={{ marginBottom: "15px" }}>
                  <img
                    id="imagePreview"
                    alt="Selected Image"
                    style={{ width: "180px", height: "auto" }}
                    src={URL.createObjectURL(image)}
                  />
                </div>
              )}

              <Button
                type="submit"
                style={{
                  width: "150px",
                  height: "40px",
                  backgroundColor: darkMode ? "#555" : "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Create Post
              </Button>
            </Form>
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
};

export default CreatePostModal;
