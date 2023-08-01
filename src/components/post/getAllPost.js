import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import moment from "moment";
import Post from "./post";

const GetAllPost = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios
      .get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllPosts`)

      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => alert("error fetching data"));
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
    axios
      .delete(`http://localhost:8095/posts/deletePost/${posts._id}`)
      .then((response) => {
        alert("Post deleted successfully");
        fetchPosts();
      })
      .catch((error) => alert("Error deleting post"));
  };

  return (
    <>
      <h1>All Posts</h1>
      <div className="d-flex flex-wrap">
        {posts.map((posts, index) => (
          <Post posts={posts} />
        ))}
      </div>
    </>
  );
};
export default GetAllPost;
