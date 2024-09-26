import axios from "axios";
import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

function CreatePostModal({ show, setShow }) {
  const [text, setText] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textAreaCount, setTextAreaCount] = useState(0);
  const maxChar = 280;
  const darkMode = false;
  const [charCountColor, setCharCountColor] = useState("gainsboro");

  const handleClose = () => setShow(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  const getWordCountColor = () => {
    if (textAreaCount >= maxChar - 1) {
      return "red";
    } else if (textAreaCount / maxChar >= 0.75) {
      return "gold";
    } else {
      return "gainsboro";
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setCharCountColor(getWordCountColor());
    setTextAreaCount(e.target.value.length);
  };
  const handleImageChange = (e) => setSelectedImage(e.target.files[0]);

  return (
    <div className="App">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="createPostID" onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                as="textarea"
                maxLength={maxChar}
                placeholder="What's on your mind?"
                name="content"
                value={text.content}
                onChange={handleTextChange}
                style={{
                  height: "150px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: `1px solid ${darkMode ? "#333" : "#ccc"}`,
                  backgroundColor: darkMode ? "#181818" : "#fff",
                  color: darkMode ? "#fff" : "#000",
                }}
              />
              <p
                style={{
                  color: charCountColor,
                  fontSize: "14px",
                  marginTop: "5px",
                }}
              >
                {textAreaCount}/{maxChar}
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
              onClick={() => document.getElementById("image").click()}
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
              }}
            >
              Create Post
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CreatePostModal;
