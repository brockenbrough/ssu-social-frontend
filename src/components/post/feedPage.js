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
    try {
        // Construct the URL to fetch the feed based on whether a user is provided
        const feedUrl = user 
            ? `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/${user.username}` 
            : `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`;

        // Fetch the feed
        const { data: { feed } } = await axios.get(feedUrl);

        // Fetch posts in parallel using Promise.all
        const postsPromises = feed.map(postId => 
            axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${postId}`)
            .catch(error => {
                console.error(`Failed to fetch a post with ID ${postId}:`, error);
                return null;  // Return null on error to filter out later
            })
        );
        
        // Wait for all post fetching promises to complete
        const postsResponses = await Promise.all(postsPromises);

        // Filter out any null or undefined responses and extract post data
        const postData = postsResponses.filter(response => response !== null).map(response => response.data);

        // Update the state with fetched posts
        setPosts(postData);
    } catch (error) {
        console.error('Failed to fetch feed:', error.message);
    }
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
  
  const todayPosts = posts
  .filter(post => (now - new Date(post.date)) <= 24 * 60 * 60 * 1000)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

  const thisWeekPosts = posts
    .filter(post => (now - new Date(post.date)) > 24 * 60 * 60 * 1000 && (now - new Date(post.date)) <= 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const aWhileAgoPosts = posts
    .filter(post => (now - new Date(post.date)) > 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  


  return (
    <>
        {posts.length === 0 ? (
            <div className="text-center" style={{fontSize: "1.5em"}}>
                <p>
                    <strong>{user.username}</strong>, your feed is empty. Visit the{" "}
                    <Link to={"/getallpost"}>
                        <a href="#">public feed</a>
                    </Link>{" "}
                    to discover posts from other users.
                </p>
            </div>
        ) : (
            <div className="App">
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
        )}
    </>
);
}