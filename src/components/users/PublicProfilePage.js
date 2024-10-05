import React, { useState, useCallback, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";
import { useDarkMode } from "../DarkModeContext.js";
import FollowButton from "../following/followButton";
import PostList from "../post/postlist";
import ProfileImage from "../images/ProfileImage.js";

export default function PublicUserList() {
  const { darkMode } = useDarkMode();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const { username } = useParams();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const containerStyle = {
    background: darkMode ? "black" : "white",
    color: darkMode ? "white" : "black",
    minHeight: "100vh",
  };

  const fetchUserInfoAndPosts = useCallback(async () => {
    try {
      const postsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );
      const sortedPosts = postsResponse.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setPosts(sortedPosts);

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${username}`
        );
        if (response.data.length > 0) {
          setFollowerCount(response.data[0].followers.length);
        } else {
          setFollowerCount(0);
        }
      } catch (error) {
        console.error(`Error fetching follower count: ${error.message}`);
      }

      var followCount;
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/following/${username}`
        );
        if (response.data.length > 0) {
          setFollowingCount(response.data[0].following.length);
          followCount = response.data[0].following.length;
        }
      } catch (error) {
        console.error(`Error fetching following count: ${error.message}`);
      }
      console.log("Post call Following Count:", followingCount);
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
    }
  }, [username]);

  const updateFollowerCount = (newFollowerCount) => {
    setFollowerCount(newFollowerCount);
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    fetchUserInfoAndPosts();

    const userInfo = getUserInfo();
    setUser(userInfo);
  }, [fetchUserInfoAndPosts]);

  if (!user) {
    return (
      <div style={{ textAlign: "center" }}>
        <h4>
          You must <a href="/login">log in</a> or <a href="/signup">register</a>{" "}
          to view this page
        </h4>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Container className="mt-5">
        <Row>
          <Col md={4} className="text-center mb-3">
            <ProfileImage />
            <h3>{username}</h3>
            <FollowButton
              className="mt-2 btn-sm"
              username={user.username}
              targetUserId={username}
              onUpdateFollowerCount={updateFollowerCount}
            />
            <div className="mt-2">
              <div>Followers: {followerCount}</div>
              <div>Following: {followingCount}</div>
            </div>
          </Col>
          <Col md={8}>
            {/* Directly use PostList to display posts of the public user profile */}
            <PostList type="publicuserprofile" profileUsername={username} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
