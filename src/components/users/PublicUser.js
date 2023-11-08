import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Container, Row, Col, Button } from "react-bootstrap";
import getUserInfo from '../../utilities/decodeJwt';
import axios from 'axios';
import Post from "../post/post";
import FollowButton from '../following/followButton';

export default function PublicUserList() {
  const [user, setUser] = useState({});
  const { username } = useParams();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );
      setPosts(response.data);
    } catch (error) {
      alert(`Unable to fetch posts by user: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`);
    }
  };

  useEffect(() => {
    fetchPosts();
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

 
  if (!user) {
    return (
      <div style={{ textAlign: "center" }}>
        <h4>
          You must <a href="/login">log in</a> or <a href="/signup">register</a> to view this page
        </h4>
      </div>
    );
  }
    
  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col className="text-center">
          <h2>
            {username} 
            <FollowButton
              className="ml-3 btn-sm"
              username={user.username}
              targetUserId={username}
            />
          </h2>
        </Col>
      </Row>

      <Row className="justify-content-center mt-1">
        <Col md={8}>
          <h4 className="text-left">Posts:</h4>
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col md={8}>
          {posts.map((post, index) => (
            <div className="mb-3" key={index}>
              <Post posts={post} />
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}
