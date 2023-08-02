import axios from "axios";
import React, { useState, useEffect } from "react";
import Post from "./post";

const GetAllPost = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllPosts`;
    const res = await axios.get(url)
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => alert(`Unable to fetch data from ${url}.`));
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
