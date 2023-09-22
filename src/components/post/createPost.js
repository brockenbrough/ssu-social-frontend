import axios from "axios"; // Import the axios library for making HTTP requests.
import React, { useState, useEffect } from "react"; // Import React and its hooks.
import { Form, Button } from "react-bootstrap"; // Import components from React Bootstrap.
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook from React Router.
import getUserInfo from "../../utilities/decodeJwt"; // Import a utility function for decoding JWT tokens.
import { Link } from "react-router-dom"; // Import the Link component from React Router.

const CreatePost = () => {
  const [user, setUser] = useState(null); // Initialize user state to null.
  const [state, setState] = useState({
    content: "",
    username: "",
  }); // Initialize state for content and username.

  useEffect(() => {
    // Use the useEffect hook to run code after the component has rendered.
    const currentUser = getUserInfo(); // Decode the JWT token to get user info.
    setUser(currentUser); // Set the user state with the decoded user info.
  }, []);

  const navigate = useNavigate(); // Initialize the navigate function for routing.

  const handleChange = (e) => {
    // Define a handleChange function to update the state when input fields change.
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    const { content, username } = state; // Destructure content and username from state.
    const post = {
      id: user.id, // Access userId directly from the user object.
      content,
      username,
    };
    await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`, post); // Send a POST request to create a new post.
    navigate("/"); // Navigate to the root page after creating the post.
  };

  if (!user) {
    // If there is no user (not authorized), render a message and a link to login.
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

  // If there is a user, render a form to create a post.
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

export default CreatePost;
