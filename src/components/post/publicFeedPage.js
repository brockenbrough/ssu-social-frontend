import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Post from "./post";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import ToggleButton from 'react-bootstrap/ToggleButton';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  async function getPosts() {
    let feed = [];
    let postData = [];
    const res = await axios.get(`http://localhost:8093/feed/`)
      .then(res => {
        feed = res.data.feed
      })
      .catch(error => alert("An error has occure while fetching feed data"))
    for (let i = 0; i < feed.length; i++) {
      const res = await axios.get(`http://localhost:8095/posts/getPostById/${feed[i]}`)
        .then(res => {
          postData.push(res.data)
        })
        .catch(error => alert("An error has occured while fetching post data"))
    }
    setPosts(postData)
  }

  useEffect(() => {
    getPosts();
  }, [posts.length]);

  return (
    <div>
      <h1>
        Welcome to the public feed page
      </h1>
      {/* <div>
        {posts.map((posts, index) => (
          <div key={index}>
            <Card style={{ width: '18rem' , marginTop:'1cm', marginLeft:'.5cm',background:'aliceblue'}}>       
              <Card.Body>
                <Card.Title><Link to={'/publicprofilepage'}>{posts.username}</Link>{}</Card.Title>
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