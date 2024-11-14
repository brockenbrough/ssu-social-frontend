import axios from "axios";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";
import { useDarkMode } from "../DarkModeContext";
import apiClient from "../../utilities/apiClient";
import { PostContext } from "../../App";
import { PostPageContext } from "../../App";

const CreatePost = ({ popupShow, setPopupShow }) => {
  const MAX_DESCRIPTION_CHAR = 280;
  const GREY_COLOR = "gainsboro";
  const GOLD_COLOR = "gold";
  const RED_COLOR = "red";

  const [user, setUser] = useState(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [charCountColor, setCharCountColor] = useState(GREY_COLOR);
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();
  const [posts, setPosts] = useContext(PostContext);
  const [postPage, setPostPage] = useContext(PostPageContext);
  const [error, setError] = useState("");
  const [isSensitive, setisSensitive] = useState(false);

  const fileInputRef = useRef(null);

  const resetState = () => {
    setDescription("");
    setImage(null);
    setThumbnail(null);
    setCharCountColor(GREY_COLOR);
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
    if (textLength === MAX_DESCRIPTION_CHAR) {
      setCharCountColor(RED_COLOR);
    } else if (textLength / MAX_DESCRIPTION_CHAR >= 0.75) {
      setCharCountColor(GOLD_COLOR);
    } else {
      setCharCountColor(GREY_COLOR);
    }
  };

  const fetchYoutubeThumbnail = async (link) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const videoId = link.match(youtubeRegex)[1];

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=YOUR_YOUTUBE_API_KEY`
      );
      const thumbnailUrl =
        response.data.items[0]?.snippet?.thumbnails?.medium?.url;
      setThumbnail(thumbnailUrl || "");
    } catch (error) {
      console.error("Error fetching YouTube video data:", error);
    }
  };

  const isYoutubeLink = (link) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(link);
  };

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setDescription(inputText);
    updateCharCountColor(inputText.length);

    if (isYoutubeLink(inputText)) {
      fetchYoutubeThumbnail(inputText);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    if (e.target.files && selectedImage) {
      let reader = new FileReader();

      reader.onload = (event) => {
        const imgPreview = event.target.result;
        document.getElementById("imagePreview").src = imgPreview;
      };

      reader.readAsDataURL(selectedImage);
    }
  };

  const handleEmptyDescription = () => {
    alert("You need a description in order to create this post.");
  };

  const saveImageAndGetImageUri = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", user.username);

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
        return data.imageUri;
      } else {
        alert("Image was not saved. HTTP status code: " + response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    return null;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const savePost = async (post) => {
    try {
      post = {
        ...post,
        id: user.id,
        content: description,
        username: user.username,
        imageUri: post.imageUri,
        isSensitive,
      };
      const response = await apiClient.post(`/posts/createPost`, post);

      // Check if the content was censored
      if (response.data.censored) {
        setDescription(response.data.content);
        setError("Your post contained disallowed content which has been censored.");
      }

      return true; // Indicate success
    } catch (err) {
      if (err.response && err.response.data) {
        const { error: errMsg, categories, flaggedWords } = err.response.data;
        if (categories) {
          setError(
            `${errMsg} Categories: ${Object.keys(categories)
              .filter((cat) => categories[cat])
              .join(", ")}`
          );
        } else if (flaggedWords) {
          setError(`${errMsg} Flagged Words: ${flaggedWords.join(", ")}`);
        } else {
          setError(errMsg);
        }
      } else {
        setError("An unexpected error occurred.");
      }
      return false; // Indicate failure
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    let post = {
      description: description,
      thumbnail: thumbnail,
      charCountColor: charCountColor,
      isSensitive,
    };

    if (!post.description.trim()) {
      alert("You need a description in order to create this post.");
      return;
    }
    setIsSubmitting(true);

    if (image) {
      const imageUri = await saveImageAndGetImageUri();
      if (imageUri) {
        post = {
          ...post,
          imageUri: imageUri,
        };
      }
    }

    const success = await savePost(post);
    setIsSubmitting(false);

    if (success) {
      // Update the posts state only if the post was successfully saved
      setPosts([...posts, { ...post, content: description }]);
      resetState();
      setPostPage(0);
      setPopupShow(false);
    }
  };


  const removeImage = () => {
    setImage(null);
    fileInputRef.current.value = "";
  };

  return (
    <>
      <Modal show={popupShow} onHide={() => setPopupShow(false)} centered>
        <div
          className="popup"
          style={{
            backgroundColor: darkMode ? "#181818" : "#fff",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          <Modal.Header closeButton closeVariant={darkMode ? "white" : "black"}>
            <Modal.Title>Create Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {user ? (
              <Form id="createPostID" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicPassword">
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

                <Form.Group controlId="formSensitiveContent" className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Mark as sensitive content"
                    checked={isSensitive}
                    onChange={(e) => setisSensitive(e.target.checked)}
                  />
                </Form.Group>

                <div
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
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />

                {image && (
                  <div className="image-preview-container">
                    <img
                      id="imagePreview"
                      alt="Selected Image"
                      className={`image-preview ${isSensitive ? "blur-lg" : ""}`}
                      src={URL.createObjectURL(image)}
                    />
                    <button
                      type="button"
                      className="delete-image-button"
                      onClick={removeImage}
                    >
                      &times;
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-orange-600 p-2 rounded-md text-white"
                  disabled={isSubmitting}
                >
                  Create Post
                </button>
              </Form>
            ) : (
              <h3>
                You are not logged in. Please log in <Link to="/">here</Link>.
              </h3>
            )}
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default CreatePost;