import React, { useState, useEffect, useContext } from "react";
import { Image } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
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
import likes from "../privateUserLikeList/PrivateUserLikeListPage";

//link to service
//http://localhost:8096/privateUserProfile

const PrivateUserProfile = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const user = useContext(UserContext);
  const username = getUserInfo().username;
  const [form, setValues] = useState({ content: "" });
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [postToDelete, setPostToDelete] = useState(null);

  const openDeleteModal = (post) => {
    setPostToDelete(post);
    handleShow();
  };

  const followerRouteChange = () => {
    navigate(`/followers/${username}`); // To use in the follower's button to switch to the user's follower's list.
  };

  const followingRouteChange = () => {
    navigate(`/following/${username}`); // To use in the following button to switch to the user's following list.
  };

  // handle logout button
  const handleLogout = (async) => {
    localStorage.clear();
    navigate("/");
  };

  // handle Edit User Information button
  const handleEditUser = (async) => {
    navigate("/editUserPage");
  };

  const fetchPosts = async () => {
    const res = await axios
      .get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => alert(`Unable to get posts from ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`));
  };

  useEffect(() => {
    fetchPosts();
    //setUser(getUserInfo())
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...form, [input.id]: input.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { content } = form;
    const post = { content, username };
    await axios
      .post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`, post)
      .then((response) => {
        fetchPosts();
        form.content = "";
      })
      .catch((error) => alert(`Unable to create post: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`));
  };

  const deleteConfirm = async (posts) => {
    if (postToDelete) {
      axios
        .delete(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/deletePost/${postToDelete._id}`)
        .then((response) => {
          handleClose();
          fetchPosts();
        })
        .catch((error) => alert(`Unable to delete post: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/deletePost/${postToDelete._id}`));
    }
  };

  const followerButtonOnClick = () => {};



  // 	<span><b>{<FollowerCount username = {username}/>}</b></span>&nbsp;
  // <span><b>{<FollowingCount username = {username}/>}</b></span>;
  return (
    <div class="container">
      <div class="col-md-12 text-center">
        <h1>{user && user.username}</h1>
        <div class="col-md-12 text-center">
          <Image
            roundedCircle
            src={"https://robohash.org/" + Math.random() + "?set=set5"}
          />
        </div>
        <div class="col-md-12 text-center">
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
        <div class="col-md-12 text-center">
          <>
            <Button className="me-2" onClick={handleShow}>
              Log Out
            </Button>
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Log Out</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to Log Out?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
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
      <h3 class="txt">Create Post</h3>

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
        controlId="formContent"
        style={{ width: "50rem" }}
      >
        <Form.Control
          type="text"
          placeholder="Enter post here"
          id="content"
          value={form.content}
          onChange={handleChange}
        />
      </Form.Group>
      <div>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <></>
      </div>
      <div>
        <h3>All Posts</h3>
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
                  {}
                </Card.Title>
                {posts.content}
                <p>{moment(posts.date).format("MMMM Do YYYY, h:mm:ss a")}</p>
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
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={deleteConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default PrivateUserProfile;
