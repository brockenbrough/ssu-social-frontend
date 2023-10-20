import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import Post from "./post";
import "./feedPageStyle.css";
import ScrollToTop from "./ScrollToTop";



import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import ToggleButton from 'react-bootstrap/ToggleButton';

export default function PostList() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getPosts(user) {
    try {
      const feedUrl = user 
          ? `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/${user.username}` 
          : `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`;
  
      const { data: { feed } } = await axios.get(feedUrl);
  
      // Fetch posts in parallel
      const postsPromises = feed.map(postId => 
          axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${postId}`)
          .then(response => response.data)
          .catch(error => console.error(`Failed to fetch post with ID ${postId}:`, error))
      );
      
      const postData = await Promise.all(postsPromises);
      setPosts(postData.filter(post => post)); 
  } catch (error) {
      console.error('Failed to fetch feed:', error.message);
  } finally {
      setIsLoading(false); // Reset loading state after data has been fetched
  }
  }

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
    if (userInfo) {
        getPosts(userInfo);
    }
}, []);  // Changed dependency to user to optimize re-renders/API calls


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
  
  const chunkArray = (array, size) => {
    const chunked_arr = [];
    let copied = [...array];  // To keep the original array unchanged
    const numOfChild = Math.ceil(copied.length / size); 
    for (let i = 0; i < numOfChild; i++) {
        chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
};

// Log the API response
console.log('API Response:', posts);

// Log the filter results
console.log('Today Posts:', todayPosts);
console.log('This Week Posts:', thisWeekPosts);
console.log('a while ago posts', aWhileAgoPosts)

return (
    <>
        {isLoading ? (
            <div className="text-center">
                {/* Updated the src attribute to point to the location of loading.gif */}
                <img src="/loading.gif" alt="Loading..." style={{ width: '50px', height: '50px' }} /> 
            </div>
        ) : posts.length === 0 ? (
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
                        {chunkArray(todayPosts, 3).map((chunk, index) => (
                            <div className="d-flex flex-wrap justify-content-center">
                                {chunk.map((post) => (
                                    <Post posts={post} className="cards m-2" />
                                ))}
                            </div>
                        ))}
                    </>
                )}
                {thisWeekPosts.length > 0 && (
                    <>
                        <div className="text-center"><h2>This Week</h2></div>
                        <hr />
                        {chunkArray(thisWeekPosts, 3).map((chunk, index) => (
                            <div className="d-flex flex-wrap justify-content-center">
                                {chunk.map((post) => (
                                    <Post posts={post} className="cards m-2" />
                                ))}
                            </div>
                        ))}
                    </>
                )}
                {aWhileAgoPosts.length > 0 && (
                    <>
                        <div className="text-center"><h2>A while ago</h2></div>
                        <hr />
                        {chunkArray(aWhileAgoPosts, 3).map((chunk, index) => (
                            <div className="d-flex flex-wrap justify-content-center">
                                {chunk.map((post) => (
                                    <Post posts={post} className="cards m-2" />
                                ))}
                            </div>
                        ))}
                    </>
                )}
            <ScrollToTop />
            </div>
            
        )}
    </>
);
}