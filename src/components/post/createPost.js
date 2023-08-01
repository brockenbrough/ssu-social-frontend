import axios from "axios";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [state, setState] = useState({
    content: "",
    username: "",
  });
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
      content,
      username,
    };
    await axios.post(" http://localhost:8095/posts/createPost", post);
    navigate("/");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={state.username}
          onChange={handleChange}
          name="username"
          style={{
            height: "2cm",
            width: "12cm",
            marginLeft: "10cm",
            marginTop: "2cm",
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control
          type="text"
          placeholder="Content"
          name="content"
          value={state.content}
          onChange={handleChange}
          s
          style={{
            height: "3cm",
            width: "12cm",
            marginLeft: "10cm",
            marginTop: "2cm",
          }}
        />
      </Form.Group>
      <Button
        style={{ width: "4cm", marginLeft: "10cm", marginTop: "2cm" }}
        variant="primary"
        type="submit"
      >
        Create Post
      </Button>
    </Form>
  );
};

export default CreatePost
