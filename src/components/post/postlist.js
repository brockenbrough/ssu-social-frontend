import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import Post from "./post";
import "./feedPageStyle.css"; 
import ScrollToTop from "./ScrollToTop";
import { useDarkMode } from '../DarkModeContext';
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import ToggleButton from 'react-bootstrap/ToggleButton';

function PostList({ type, username }) {
    const { darkMode } = useDarkMode();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function getPosts() {
        let url;
        if (type === "feed") {
            url = username 
                ? `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/${username}` 
                : `${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`;
        } else if (type === "all") {
            url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllPosts`;
        }

        try {
            const response = await axios.get(url);
            if (type === "feed") {
                const feed = response.data.feed;
                const postsPromises = feed.map(postId => 
                    axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${postId}`)
                    .then(res => res.data)
                    .catch(error => console.error(`Failed to fetch post with ID ${postId}:`, error))
                );
                const postData = await Promise.all(postsPromises);
                setPosts(postData.filter(post => post));
            } else {
                setPosts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const userInfo = getUserInfo();
        setUser(userInfo);
        getPosts();
    }, [type, username]);
    
      const now = new Date();
      const todayPosts = posts
      .filter(post => (now - new Date(post.date)) <= 24 * 60 * 60 * 1000)
      .sort((a, b) => new Date(b.date) - new Date(a.date));  // Newest at the top
  
  const thisWeekPosts = posts
      .filter(post => (now - new Date(post.date)) > 24 * 60 * 60 * 1000 && (now - new Date(post.date)) <= 7 * 24 * 60 * 60 * 1000)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const aWhileAgoPosts = posts
      .filter(post => (now - new Date(post.date)) > 7 * 24 * 60 * 60 * 1000)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

      const timeCategories = [
        { title: "Today", posts: todayPosts },
        { title: "This Week", posts: thisWeekPosts },
        { title: "A while ago", posts: aWhileAgoPosts },
    ];
    
      const chunkArray = (array, size) => {
        const chunked_arr = [];
        let copied = [...array];  
        const numOfChild = Math.ceil(copied.length / size); 
        for (let i = 0; i < numOfChild; i++) {
            chunked_arr.push(copied.splice(0, size));
        }
        return chunked_arr;
    };
    
    console.log('API Response:', posts);
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
                <div className="text-center" style={{fontSize: "1.5em", }}>
                    <p>
                        <strong>{user.username}</strong>, your feed is empty. Visit the{" "}
                        <Link to={"/getallpost"}>
                            <a href="#">public feed</a>
                        </Link>{" "}
                        to discover posts from other users.
                    </p>
                </div>
            ) : (
                <div className="App" style={{backgroundColor: darkMode ? "#000" : "#f6f8fa", color: darkMode ? "#fff" : "#000", minHeight: '100vh',}}>
                    {timeCategories.map((category) => {
                    return (
                        category.posts.length > 0 && (
                        <>
                            <div className="text-center">
                            <h2>{category.title}</h2>
                            </div>
                            <hr />
                            {chunkArray(category.posts, 3).map((chunk, index) => (
                            <div className="d-flex flex-wrap justify-content-center">
                                {chunk.map((post) => (
                                <Post posts={post} className="cards m-2" />
                                ))}
                            </div>
                            ))}
                        </>
                        )
                    );
                    })}
                    <ScrollToTop />
                </div>
                
            )}
        </>
    );
}

export default PostList;
