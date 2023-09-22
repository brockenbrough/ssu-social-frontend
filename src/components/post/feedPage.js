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
        if (error.response && error.response.status === 400 && error.response.data === "Error: invalid username") {
          console.log("Invalid username error.");
        } else {
          alert(`Failed to fetch feed for user: ${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/${user.username}`);
        }
      }
    } else {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`);
        feed = res.data.feed;
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data === "Error: Username was found, but this person does not follow anyone.") {
          console.log("Person does not follow anyone error.");
        } else {
          alert(`Failed to fetch public feed: ${process.env.REACT_APP_BACKEND_SERVER_URI}/feed/`);
        }
      }
    }
    
    for (let i = 0; i < feed.length; i++) {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${feed[i]}`);
        postData.push(res.data);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          console.log(`Bad Request: Failed to fetch a post in feed: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${feed[i]}`);
        } else {
          alert(`Failed to fetch a post in feed: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${feed[i]}`);
        }
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
      <p>
        If you are not seeing any posts, visit the public feed page. Once you follow some other users, you will see their posts here!
      </p>
      <Button variant="primary" className="mx-1 my-1" href={`/createpost/`}>
        Create Post
      </Button>
      {/* <div>
        {posts.map((posts, index) => (
          <div key={index}>
            <Card style={{ width: '18rem' , marginTop:'1cm', marginLeft:'.5cm',background:'aliceblue'}}>       
              <Card.Body>
                <Card.Title><Link to={'/publicprofilepage'} state={{ publicUser : posts }}>{posts.username}</Link>{}</Card.Title>
                {posts.content}
                <div>
                  <ToggleButton href='#'>👍</ToggleButton>
                </div>
              </Card.Body>
              <Card.Footer>{posts.date}</Card.Footer>
            </Card>
          </div>
        ))}
      </div> */}
      <div>
        {posts.map(e => {
          return <Post posts = {e} isLiked={"true"}/>
        })}
      </div>
    </div>
  );
}