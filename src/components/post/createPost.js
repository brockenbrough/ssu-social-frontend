import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { Link } from "react-router-dom";

const CreatePost = () => {
  const [user, setUser] = useState(null);
  const [state, setState] = useState({
    content: "",
    username: "",
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
    id: user.id, // Access userId directly
    content,
    username,
  };
  await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`, post);
  navigate("/");
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
