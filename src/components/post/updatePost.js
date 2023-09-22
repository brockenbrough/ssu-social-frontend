import React, { useState, useEffect } from 'react'; // Import React and its hooks.
import axios from 'axios'; // Import the axios library for making HTTP requests.
import { useParams, useNavigate } from "react-router"; // Import useParams and useNavigate hooks from React Router.
import Navbar from '../navbar'; // Import a Navbar component.
import getUserInfo from "../../utilities/decodeJwt"; // Import a utility function for decoding JWT tokens.
import { Link } from "react-router-dom"; // Import the Link component from React Router.

import { Form, Button } from 'react-bootstrap'; // Import Form and Button components from React Bootstrap.

const UpdatePost = (props) => {

    const [user, setUser] = useState(null); // Initialize user state to null.
    const [state, setState] = useState({
        username: '',
        content: '',
    }); // Initialize state for username and content.
    const params = useParams(); // Get the URL parameters using useParams.

    const navigate = useNavigate(); // Initialize the navigate function for routing.

    useEffect(() => {
        setUser(getUserInfo()); // Use the useEffect hook to set the user state by decoding JWT.
    }, []);

    useEffect(() => {
        // Use the useEffect hook to fetch and update post data based on the postId from the URL.
        axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${params.postId}`)
            .then(res => {
                setState(res.data); // Update state with the retrieved post data.
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const handleChange = (e) => {
        // Define a handleChange function to update the state when input fields change.
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior.
        axios.put(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/updatePost/${params.postId}`, state)
            .then(res => {
                console.log(res);
                navigate(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllPosts/${params.postId}`);
                // After submitting the form, navigate to a specific route.
            })
            .catch(err => {
                console.log(err);
            });
    };

    const showUpdateForm = () => {
        // Define a function to render the update form.

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
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="text" placeholder="Enter username" value={state.username} onChange={handleChange} name="username" style={{ height: '2cm', width: '12cm', marginLeft: '10cm', marginTop: '2cm' }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Control type="text" placeholder="Content" name="content" value={state.content} onChange={handleChange} style={{ height: '3cm', width: '12cm', marginLeft: '10cm', marginTop: '2cm' }} />
                            </Form.Group>
                            <Button style={{ width: '4cm', marginLeft: '10cm', marginTop: '2cm' }} variant="primary" type="submit">
                                Update
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container pb-5">
            <h1>UPDATE POST</h1>
            {showUpdateForm()} {/* Render the update form based on user authorization. */}
        </div>
    );
}

export default UpdatePost;
