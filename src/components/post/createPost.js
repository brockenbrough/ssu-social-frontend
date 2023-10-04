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
    e.preventDefault();
    const { content, username } = state;
    const post = {
      id: user.id, // Access userId directly
      content,
      username: user.username,
    };
    await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`, post);
    navigate("/getAllPost");
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

  return (
    <Form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Adjust as needed
        backgroundColor: "#f6f8fa", // Light gray background color
      }}
    >
      <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: "60%" }}>
        <Form.Control
          type="text"
          placeholder="What's on your mind?"
          name="content"
          value={state.content}
          onChange={handleChange}
          style={{
            height: "3cm",
            width: "100%",
          }}
        />
      </Form.Group>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '60%' }}>
        <img src="/add-img-icon.png" alt="Add Image Icon" style={{ width: '60px', height: '60px', marginTop: '.5cm' }} />
        <img src="/addVideo.png" alt="Add Video Icon" style={{ width: '60px', height: '60px', marginTop: '.5cm' }} />
      </div>

      <Button
        style={{
          width: "8cm", // Make the button wider
          marginTop: "1cm", // Adjust the margin
          backgroundColor: "#28a745", // Green button color
          borderColor: "#28a745", // Green border color
        }}
        variant="primary"
        type="submit"
        size="lg" // Make the button larger
      >
        Create Post
      </Button>
    </Form>
  );


};

export default CreatePost;