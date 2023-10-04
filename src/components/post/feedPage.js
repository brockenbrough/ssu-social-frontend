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

  const now = new Date();
  const todayPosts = posts.filter(post => (now - new Date(post.date)) <= 24 * 60 * 60 * 1000);
  const thisWeekPosts = posts.filter(post => (now - new Date(post.date)) > 24 * 60 * 60 * 1000 && (now - new Date(post.date)) <= 7 * 24 * 60 * 60 * 1000);
  const aWhileAgoPosts = posts.filter(post => (now - new Date(post.date)) > 7 * 24 * 60 * 60 * 1000);
  


return (
    <>
        <div className="container">
        <div className="text-center"><h1>Welcome to your feed {user.username}</h1></div>
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
                    <div className="text-center"><h2>A while ago</h2></div>
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

}