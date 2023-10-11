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
    await axios.get(url)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        alert(`Unable to fetch data from ${url}.`);
        setPosts([]);  // Set posts to an empty array in case of an error
      });
  };

  const now = new Date();
  const todayPosts = posts.filter(post => (now - new Date(post.date)) <= 24 * 60 * 60 * 1000);
  const thisWeekPosts = posts.filter(post => (now - new Date(post.date)) > 24 * 60 * 60 * 1000 && (now - new Date(post.date)) <= 7 * 24 * 60 * 60 * 1000);
  const aWhileAgoPosts = posts.filter(post => (now - new Date(post.date)) > 7 * 24 * 60 * 60 * 1000);

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
        <div className={`App ${darkMode ? "dark-mode" : ""}`}>
            <div className="toggle-container">
            <button onClick={toggleDarkMode} id="darkButton">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>

            </div>
            <div className="text-center"><h1>Welcome to the Explore Page</h1></div>

            {todayPosts.length > 0 && (
                <>
                    <div className="text-center"><h2>Today</h2></div>
                    <hr />
                    <div className="d-flex flex-wrap">
                        {todayPosts.map((post, index) => (
                            <Post id="cards" posts={post} />
                        ))}
                    </div>
                </>
            )}
            {thisWeekPosts.length > 0 && (
                <>
                    <div className="text-center"><h2>This Week</h2></div>
                    <hr />
                    <div className="d-flex flex-wrap">
                        {thisWeekPosts.map((post, index) => (
                            <Post id="cards" posts={post} />
                        ))}
                    </div>
                </>
            )}
            {aWhileAgoPosts.length > 0 && (
                <>
                    <div className="text-center"><h2>A While Ago</h2></div>
                    <hr />
                    <div className="d-flex flex-wrap">
                        {aWhileAgoPosts.map((post, index) => (
                            <Post id="cards" posts={post} />
                        ))}
                    </div>
                </>
            )}
        </div>
    </>
);
};

export default GetAllPost;
