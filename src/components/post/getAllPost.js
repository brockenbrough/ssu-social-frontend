import axios from "axios";
import React, { useState, useEffect } from "react";
import Post from "./post";
import "./postStyles.css";

const GetAllPost = () => {
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <>
    <div div className={`App ${darkMode ? "dark-mode" : ""}`}>
    <div className="toggle-container">
        <button onClick={toggleDarkMode} id="darkButton">
          Dark Mode
        </button>
      </div>
      <h1>All Posts</h1>
      <div  className="d-flex flex-wrap">
        {posts.map((posts, index) => (
          <Post id="cards" posts={posts} />
        ))}
      </div>
      </div>
    </>
  );
};
export default GetAllPost;
