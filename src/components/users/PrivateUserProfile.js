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
import { useParams } from 'react-router-dom';


const PrivateUserProfile = () => {
  // State for showing delete confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleShowDeleteConfirmation = () => setShowDeleteConfirmation(true);

  // State for showing logout confirmation modal
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const handleCloseLogoutConfirmation = () => setShowLogoutConfirmation(false);
  const handleShowLogoutConfirmation = () => setShowLogoutConfirmation(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const handleCloseUploadModal = () => setShowUploadModal(false);
  const handleShowUploadModal = () => setShowUploadModal(true);

  const { username } = useParams();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImageFilename, setProfileImageFilename] = useState("");
  const [userProfileImage, setUserProfileImage] = useState("");
  
  

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
};


const onUpload = async () => {
  if (selectedFile) {
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      console.log('Username:', username);
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/updateProfileImage/${username}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUserProfileImage(res.data.filePath);  // Update the profile image in the state
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  } else {
    console.error("No files selected");
  }
};


  const profileImageUrl = profileImageFilename ? `./routes/users/user.images/image/${profileImageFilename}` : "https://robohash.org/" + Math.random() + "?set=set5";


  // Fetch the user context
  const user = useContext(UserContext);
  const handleUsername = user ? user.username : null;
  

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

  useEffect(() => {
    async function fetchProfileImage() {
      try {
        // Get the filename associated with the user
        const response = await axios.get(`/some-endpoint-to-get-filename/${username}`);
        const filename = response.data.filename;
  
        // Now use the filename to get the image
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/profileImage/${filename}`);
        setUserProfileImage(res.data.filePath);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    }
  
    fetchProfileImage();
  }, [username]);


  return (
    <div className="container">
      <div className="col-md-12 text-center">
        <h1>{user && user.username}</h1>
        <div className="col-md-12 text-center">
        <Image roundedCircle src={profileImageFilename} />
          <Button onClick={handleShowUploadModal}>Change Profile Picture</Button>
        </div>
        
        <div className="col-md-12 text-center">
          <ul>
            <Button onClick={followerRouteChange} variant="light">
              {<FollowerCount username={username} />}
            </Button>
            <Button onClick={followingRouteChange} variant="light">
              {<FollowingCount username={username} />}
            </Button>
            <Button variant="light">800 Likes</Button>
          </ul>
        </div>

        <div className="col-md-12 text-center">
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
        </div>
      </div>

      <h3 className="txt">Create Post</h3>
      <Card.Header>{user && user.username}</Card.Header>
      <div>
        <Row>
          <Col xs={12} sm={4} md={4}>
          <Image roundedCircle src={profileImageUrl} />
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

      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>

      <h3>All Posts</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '1rem' }}>
        {posts.map((post, index) => (
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
                  <Link to={"/publicprofilepage"}>{post.username}</Link>
                </Card.Title>
                {post.content}
                <p>{moment(post.date).format("MMMM Do YYYY, h:mm A")}</p>
                <Link
                  style={{ marginRight: "1cm" }}
                  to={`/updatePost/${post._id}`}
                  className="btn btn-warning"
                >
                  Update
                </Link>
                <Button variant="danger" onClick={() => openDeleteModal(post)}>
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
              
<Modal show={showUploadModal} onHide={handleCloseUploadModal}>
    <Modal.Header closeButton>
        <Modal.Title>Change Profile Picture</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <input type="file" onChange={onFileChange} />
        {selectedImage && (
            <img 
                src={URL.createObjectURL(selectedImage)} 
                alt="Selected Profile" 
                style={{ width: '100%', marginTop: '10px' }} 
            />
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseUploadModal}>
            Close
        </Button>
        <Button onClick={onUpload}>Upload Profile Image</Button>
    </Modal.Footer>
</Modal>

    </div>
);
};

export default PrivateUserProfile;
