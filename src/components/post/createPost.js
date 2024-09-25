import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwtAsync";
import { useDarkMode } from "../DarkModeContext";

import image1 from "../users/1.jpg";
import image4 from "../users/4.jpg";
import image6 from "../users/6.jpg";
import CreatePostModal from "./createPostModal";

const CreatePost = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [image1, image4, image6];

  const getNextImageIndex = () =>
    (currentImageIndex + 1) % backgroundImages.length;

  const [user, setUser] = useState(null);
  const [state, setState] = useState({ content: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textAreaCount, setTextAreaCount] = useState(0);
  const [color, setColor] = useState("gainsboro");
  const [show, setShow] = useState(false);

  const handlePopupBtn = () => {
    setShow(true);
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
    const slideshowInterval = setInterval(() => {
      setCurrentImageIndex(getNextImageIndex());
    }, 5000);

    return () => clearInterval(slideshowInterval);
  }, [currentImageIndex]);

  const backgroundStyling = {
    background: "#FFFFFF",
    backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const navigate = useNavigate();

  const fetchYouTubeData = async (videoId) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyAV6-k-24JeM4Lmd3Q5V3n-5YK1hxEtmU4`
      );
      const thumbnailUrl =
        response.data.items[0]?.snippet?.thumbnails?.medium?.url;
      setThumbnail(thumbnailUrl || "");
    } catch (error) {
      console.error("Error fetching YouTube video data:", error);
    }
  };

  const handleTextChange = (e) => {
    setTextAreaCount(e.target.value.length);
    if (textAreaCount >= maxText - 1) {
      setColor("red");
    } else if (textAreaCount / maxText >= 0.75) {
      setColor("gold");
    } else {
      setColor("gainsboro");
    }
    const { name, value } = e.target;
    setState({ ...state, [name]: value });

    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = value.match(youtubeRegex);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      fetchYouTubeData(videoId);
    }
  };

  const { darkMode } = useDarkMode();
  const maxText = 280;

  const handleImageClick = () => {
    document.getElementById("image").click();
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
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
    if (!state.content.trim()) {
      alert("You need a description in order to create this post.");
      return;
    }

    let post = {};

    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
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
          const { content } = state;
          post = {
            id: user.id,
            content,
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
      const { content } = state;
      post = {
        ...post,
        id: user.id,
        content,
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
    <div className="App" style={{ ...backgroundStyling }}>
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
            <CreatePostModal show={show} setShow={setShow} />
          </div>

          <Form.Control
            as="textarea"
            maxLength={maxText}
            placeholder="What's on your mind?"
            name="content"
            value={state.content}
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
          <p style={{ color: color, fontSize: "14px", marginTop: "5px" }}>
            {textAreaCount}/{maxText}
          </p>
          {thumbnail && (
            <div style={{ marginTop: "10px" }}>
              <img
                id="youtubeThumbnail"
                alt="YouTube Video Thumbnail"
                style={{ width: "150px", height: "auto" }}
                src={thumbnail}
              />
            </div>
          )}
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

        {selectedImage && (
          <div style={{ marginBottom: "15px" }}>
            <img
              id="imagePreview"
              alt="Selected Image"
              style={{ width: "180px", height: "auto" }}
              src={URL.createObjectURL(selectedImage)}
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
