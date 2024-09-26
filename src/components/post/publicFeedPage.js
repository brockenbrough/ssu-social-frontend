import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "./post";

export default function PostList() {
  const [posts, setPosts] = useState([]);

  async function getPosts() {
    let feed = [];
    let postData = [];
    const res = await axios.get(`http://localhost:8093/feed/`)
      .then(res => {
        feed = res.data.feed
      })
      .catch(error => alert("An error has occurred while fetching feed data"))
    for (let i = 0; i < feed.length; i++) {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${feed[i]}`)
        .then(res => {
          postData.push(res.data)
        })
        .catch(error => alert("An error has occurred while fetching post data"))
    }
    setPosts(postData)
  }

  useEffect(() => {
    getPosts();
  }, [posts.length]);

  return (
    <div>
      <h1>
        Discover
      </h1>

      <div>
        {posts.map(e => {
          return <Post posts = {e} isLiked={"true"}/>
        })}
      </div>
    </div>
  );
}