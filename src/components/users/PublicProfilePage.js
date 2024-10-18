import React, { useState, useCallback, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FollowButton from "../following/followButton";
import Post from "../post/post.js";

export default function PublicUserList() {
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(""); // State for profile image
  const { username } = useParams();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Default Profile Image URL
  const defaultProfileImageUrl = "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png"; // S3 default image URL

  const fetchUserInfoAndPosts = useCallback(async () => {
    try {
      // Fetch user data by username
      const userResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUserByUsername/${username}`
      );
      setUser(userResponse.data);
  
      // Set profile image or default if none exists
      const fetchedProfileImage = userResponse.data.profileImage;
  
      if (fetchedProfileImage) {
        // Check if the image exists in S3 by sending a HEAD request
        try {
          await axios.head(fetchedProfileImage);
          setProfileImage(fetchedProfileImage); // Image exists, use it
        } catch (error) {
          // Image doesn't exist in S3, fallback to default
          setProfileImage(defaultProfileImageUrl);
        }
      } else {
        setProfileImage(defaultProfileImageUrl); // No image found, use default
      }
  
      // Fetch user posts
      const postsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );
      const sortedPosts = postsResponse.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setPosts(sortedPosts);
  
      // Fetch follower count
      const followerResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${username}`
      );
      setFollowerCount(followerResponse.data.length > 0 ? followerResponse.data[0].followers.length : 0);
  
      // Fetch following count
      const followingResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/following/${username}`
      );
      setFollowingCount(followingResponse.data.length > 0 ? followingResponse.data[0].following.length : 0);
  
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      setProfileImage(defaultProfileImageUrl); // Fallback to default image on error
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
  }, [fetchUserInfoAndPosts]);

  if (!user || !user.username) {
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
    <div className="ssu-page-container">
      <div className="profile-header">
        <div className="profile-image">
          <img src={profileImage} alt="Profile" />
        </div>
        <div className="profile-info">
          <div className="username">{user.username}</div>
          <FollowButton
            className="ssu-button-bold"
            username={user.username}
            targetUserId={user._id}
            onUpdateFollowerCount={updateFollowerCount}
          />
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{followerCount}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{followingCount}</span>
              <span className="stat-label">following</span>
            </div>
          </div>
          <div className="profile-bio">
            {user.biography}
          </div>
        </div>
      </div>
      
      <div className="profile-posts">
        {posts.map((post, index) => (
          <Post key={index} posts={post} />
        ))}
      </div>
    </div>
  );
}