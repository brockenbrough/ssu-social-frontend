import axios from "axios";
import React, { useState, useEffect } from "react";
import Post from "./post";
import "./postStyles.css";
import { Modal, Button } from "react-bootstrap";

const GetAllPost = () => {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [selectedPost, setSelectedPost] = useState(null);


  const fetchPosts = async () => {
    const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllPosts`;
    const res = await axios.get(url)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => alert(`Unable to fetch data from ${url}.`));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deleteConfirm = (posts) => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      deletePost(posts);
    }
  };

  const deletePost = async (posts) => {
    const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/deletePost/${posts._id}`;
    axios
      .delete(url)
      .then((response) => {
        alert("Post deleted successfully");
        fetchPosts();
      })
      .catch((error) => alert(`Error deleting post: ${url}.`));
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const PostModal = ({ post, onClose }) => {
    return (
      <Modal show={showModal} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Post posts={post} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <div div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <div className="toggle-container">
          <button onClick={toggleDarkMode} id="darkButton">
            Dark Mode
          </button>
        </div>
        <h1>All Posts</h1>
        <div className="d-flex flex-wrap">
          {posts.map((posts, index) => (
            <div
              key={posts._id}
              className="post-card" // You can style this class for the post card
              onClick={() => handlePostClick(posts)} // Handle click event
            >
              <Post id="cards" posts={posts} />
            </div>
          ))}
        </div>
      </div>
  
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setShowModal(false)} />
      )}
    </>
  );
      }
export default GetAllPost;
