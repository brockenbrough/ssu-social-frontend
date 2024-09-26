import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwtAsync";
import { useDarkMode } from "../DarkModeContext";
import CreatePostModal from "./createPostModal";

const CreatePost = () => {
  const MAX_DESCRIPTION_CHAR = 280;
  const GREY_COLOR = "gainsboro";
  const GOLD_COLOR = "gold";
  const RED_COLOR = "red";

  const [user, setUser] = useState(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [charCountColor, setCharCountColor] = useState(GREY_COLOR);
  const [popupShow, setPopupShow] = useState(false);
  const navigate = useNavigate();

  const handlePopupBtn = () => {
    setPopupShow(true);
  };

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
    if (textLength == MAX_DESCRIPTION_CHAR) {
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

  const { darkMode } = useDarkMode();

  const handleImageClick = () => {
    document.getElementById("image").click();
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event) => {
        const imgPreview = event.target.result;
        document.getElementById("imagePreview").src = imgPreview;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if content is empty
    if (!description.trim()) {
      alert("You need a description in order to create this post.");
      return;
    }

    let post = {};

    if (image) {
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
          post = {
            id: user.id,
            content: description,
            username: user.username,
            imageId: data.imageId,
          };
        } else {
          alert("Image was not saved. HTTP status code: " + response.status);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

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
      navigate("/getAllPost");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (!user) {
    return (
      <div>
        <h3>
          You are not authorized to view this page. Please log in{" "}
          <Link to="/login">here</Link>.
        </h3>
      </div>
    );
  }

  return (
    <div className="App">
      <Form
        id="createPostID"
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: darkMode ? "#181818" : "#f6f8fa",
          color: darkMode ? "#fff" : "#000",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: darkMode
            ? "0 0 10px rgba(255,255,255,0.2)"
            : "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <Form.Group
          className="mb-3"
          controlId="formBasicPassword"
          style={{ width: "100%" }}
        >
          <div>
            <Button onClick={handlePopupBtn}>Popup Create Post</Button>
            <CreatePostModal show={popupShow} setShow={setPopupShow} />
          </div>

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
              boxShadow: darkMode
                ? "0 0 5px rgba(255,255,255,0.2)"
                : "0 0 5px rgba(0,0,0,0.1)",
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
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = darkMode
              ? "#666"
              : "#0056b3")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = darkMode
              ? "#555"
              : "#007bff")
          }
        >
          Create Post
        </Button>
      </Form>
    </div>
  );
};

export default CreatePost;
