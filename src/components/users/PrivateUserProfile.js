import React, { useState, useEffect, useContext, useCallback } from "react";
import { Image } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { UserContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import getUserInfo from "../../utilities/decodeJwt";
import Form from "react-bootstrap/Form";
import FollowerCount from "../following/getFollowerCount";
import FollowingCount from "../following/getFollowingCount";

const PrivateUserProfile = () => {
  // State for showing delete confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleShowDeleteConfirmation = () => setShowDeleteConfirmation(true);

  // State for showing logout confirmation modal
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const handleCloseLogoutConfirmation = () => setShowLogoutConfirmation(false);
  const handleShowLogoutConfirmation = () => setShowLogoutConfirmation(true);

  // Fetch the user context
  const user = useContext(UserContext);
  const username = user ? getUserInfo().username : null; // Check if user is defined

  // State for the form to create a new post
  const [form, setForm] = useState({ content: "" });

  // State to store user's posts
  const [posts, setPosts] = useState([]);

  // Used for navigation
  const navigate = useNavigate();

  // State for the post to be deleted
  const [postToDelete, setPostToDelete] = useState(null);

  // Function to open the delete confirmation modal
  const openDeleteModal = (post) => {
    setPostToDelete(post);
    handleShowDeleteConfirmation();
  };

  // Function to navigate to follower list
  const followerRouteChange = () => {
    navigate(`/followers/${username}`);
  };

  // Function to navigate to following list
  const followingRouteChange = () => {
    navigate(`/following/${username}`);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Function to navigate to user edit page
  const handleEditUser = () => {
    navigate("/editUserPage");
  };

  // Function to fetch user's posts
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );
      setPosts(res.data);
    } catch (error) {
      alert(
        `Unable to get posts from ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );
    }
  }, [username]); // Include only the username as a dependency

  // Fetch user's posts when the component mounts and when username changes
  useEffect(() => {
    fetchPosts();
  }, [username, fetchPosts]); // Include username and fetchPosts as dependencies

  // Handle changes in the form input
  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm({ ...form, [id]: value });
  };

  // Handle the submission of a new post
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { content } = form;
    const newPost = { content, username };
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`,
        newPost
      );
      fetchPosts();
      setForm({ content: "" });
    } catch (error) {
      alert(
        `Unable to create post: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`
      );
    }
  };
 
  // Handle the deletion of a post
  const deleteConfirm = async () => {
    if (postToDelete) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/deletePost/${postToDelete._id}`
        );
        handleCloseDeleteConfirmation();
        fetchPosts();
      } catch (error) {
        alert(
          `Unable to delete post: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/deletePost/${postToDelete._id}`
        );
      }
    }
  };

  return (
    <div className="container">
      <div className="col-md-12 text-center">
        <h1>{user && user.username}</h1>
        <div className="col-md-12 text-center">
          <Image
            roundedCircle
            src={"https://robohash.org/" + Math.random() + "?set=set5"}
          />
        </div>
        <div className="col-md-12 text-center">
          <ul>
            <Button onClick={followerRouteChange} variant="light">
              {<FollowerCount username={username} />}
            </Button>{" "}
            <Button onClick={followingRouteChange} variant="light">
              {<FollowingCount username={username} />}
            </Button>{" "}
            <Button variant="light">800 Likes</Button>{" "}
          </ul>
        </div>
        <div className="col-md-12 text-center">
          <>
            <Button className="me-2" onClick={handleShowLogoutConfirmation}>
              Log Out
            </Button>
            <Modal
              show={showLogoutConfirmation}
              onHide={handleCloseLogoutConfirmation}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Log Out</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseLogoutConfirmation}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleLogout}>
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
            <Button onClick={handleEditUser}>Edit User Information</Button>
          </>
        </div>
      </div>
      <h3 className="txt">Create Post</h3>

      <Card.Header>{user && user.username}</Card.Header>
      <div>
        <Row>
          <Col xs={12} sm={4} md={4}>
            <Image
              width="150"
              roundedCircle
              src={"https://robohash.org/" + Math.random()}
            />
          </Col>
        </Row>
        <Card style={{ width: "5rem" }}></Card>
      </div>
      <Form.Group
        className="mb-3"
        controlId="content"
        style={{ width: "50rem" }}
      >
        <Form.Control
          type="text"
          placeholder="Enter post here"
          value={form.content}
          onChange={handleChange}
        />
      </Form.Group>
      <div>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <div>
        <h3>All Posts</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '1rem' }}>
        {posts.map((posts, index) => (
          <div key={index}>
            <Card
              style={{
                width: "18rem",
                marginTop: "1cm",
                marginLeft: ".5cm",
                background: "aliceblue",
              }}
            >
              <Card.Body>
                <Card.Title>
                  <h5>Username:</h5>
                  <Link to={"/publicprofilepage"}>{posts.username}</Link>
                </Card.Title>
                {posts.content}
                <p>{moment(posts.date).format("MMMM Do YYYY, h:mm A")}</p>
                <Link
                  style={{ marginRight: "1cm" }}
                  to={`/updatePost/${posts._id}`}
                  className="btn btn-warning "
                >
                  Update
                </Link>
                <Button variant="danger" onClick={() => openDeleteModal(posts)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
        
      </div>
      <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
            No
          </Button>
          <Button variant="primary" onClick={deleteConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};


export default PrivateUserProfile;