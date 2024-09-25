import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

function CreatePostModal({ show, setShow }) {
  const [state, setState] = useState({ content: "" });
  const [thumbnail, setThumbnail] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textAreaCount, setTextAreaCount] = useState(0);
  const maxText = 300;
  const darkMode = false; // Set to true for dark mode
  const color = darkMode ? "#fff" : "#000";

  const handleClose = () => setShow(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };
  const handleTextChange = (e) => {
    setState({ ...state, content: e.target.value });
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
