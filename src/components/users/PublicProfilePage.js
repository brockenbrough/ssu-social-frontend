import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import getUserInfo from '../../utilities/decodeJwt';
import { useDarkMode } from '../DarkModeContext.js';
import DarkModeButton from '../DarkModeButton';
import FollowButton from '../following/followButton';

export default function PublicUserList() {
  const { darkMode } = useDarkMode();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const { username } = useParams();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const containerStyle = {
    background: darkMode ? 'black' : 'white',
    color: darkMode ? 'white' : 'black',
    minHeight: '100vh',
  };

  const fetchUserInfoAndPosts = useCallback(async () => {
    try {
      const postsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );
      setPosts(postsResponse.data);

      const followerResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/count/${username}`
      );
      setFollowerCount(followerResponse.data.count); 

      const followingResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/following/count/${username}`
      );
      setFollowingCount(followingResponse.data.count); 
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      // Handle errors as needed
    }
  }, [username]);

  useEffect(() => {
    fetchUserInfoAndPosts();
  }, [fetchUserInfoAndPosts]);

  useEffect(() => {
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
    <div style={containerStyle}>
      <DarkModeButton />
      <Container className="mt-5">
        <Row>
          <Col md={4} className="text-center mb-3">
            <Image
              src={"https://robohash.org/" + username + "?set=set5"}
              roundedCircle
              style={{ width: '150px', height: '150px' }}
            />
            <h3>{username}</h3>
            <FollowButton
              className="mt-2 btn-sm"
              username={user.username}
              targetUserId={username}
            />
            <div className="mt-2">
              <div>Followers: {followerCount}</div>
              <div>Following: {followingCount}</div>
            </div>
          </Col>
          <Col md={8}>
            <Row className="justify-content-center mt-3">
              {posts.map((post, index) => (
                <Col md={12} key={index} className="mb-3">
                  <Card
                    style={{
                      background: darkMode ? '#181818' : 'aliceblue',
                      color: darkMode ? 'white' : 'black',
                    }}
                  >
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/publicprofilepage/${post.username}`} style={{ color: darkMode ? 'white' : 'black' }}>
                          {post.username}
                        </Link>
                      </Card.Title>
                      {post.content}
                      <p>{moment(post.date).format('MMMM Do YYYY, h:mm A')}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
