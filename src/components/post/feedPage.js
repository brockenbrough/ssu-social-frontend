import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import Post from "./post";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import ToggleButton from 'react-bootstrap/ToggleButton';

export default function PostList() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  async function getPosts(user) {
    let feed = [];
    let postData = [];
    if (user !== null) {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/${user.username}`);
        feed = res.data.feed;
      } catch (error) {
        console.error(`Failed to fetch feed for user: ${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/${user.username}`);
      }
    } else {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`);
        feed = res.data.feed;
      } catch (error) {
        console.error(`Failed to fetch public feed: ${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`);
      }
    }
    
    for (let i = 0; i < feed.length; i++) {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${feed[i]}`);
        postData.push(res.data);
      } catch (error) {
        console.error(`Failed to fetch a post in feed: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${feed[i]}`);
      }
    }
    
    setPosts(postData)
  }

  useEffect(() => {
    setUser(getUserInfo());
    getPosts(user);
  }, [posts.length]);

  if (!user) {
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
    <div>
      <h1>
        Welcome to your feed {user.username}
      </h1>
      {posts.length === 0 ? (
        <p>
          {user.username}, your feed is empty. Visit the{" "}
          <Link to={"/getallpost"}>
            <a href="#">public feed</a>
          </Link>{" "}
          to discover posts from other users.
        </p>
      ) : (
        <>
          <Button variant="primary" className="mx-1 my-1" href={`/createpost/`}>
            Create Post
          </Button>
          <div>
            {posts.map(e => {
              return <Post posts={e} isLiked={"true"} />
            })}
          </div>
        </>
      )}
    </div>
  );
}