import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FollowButton from "../following/followButton";
import Post from "../post/post.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal"; // Ensure you have this package installed for modal functionality
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";
import Chat from "../chat/chat.js";

export default function PublicUserList() {
  const [loggedInUsername, setLoggedInUsername] = useState({});
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [profileImage, setProfileImage] = useState(
    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png"
  );
  const { username } = useParams();
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true); // New loading state
  const [filter, setFilter] = useState("upload"); // State for post filter
  const [mediaPosts, setMediaPosts] = useState([]); // State for media posts
  const [textPosts, setTextPosts] = useState([]); // State for text posts
  const [showPostModal, setShowPostModal] = useState(false); // Modal visibility
  const [selectedPostIndex, setSelectedPostIndex] = useState(0); // Index for modal post
  const [targetChatUser, setTargetChatUser] = useState(null);
  const [shouldRenderFollowButton, setShouldRenderFollowButton] =
    useState(false);
  const defaultProfileImageUrl =
    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";

  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfoAsync();
      if (userInfo) {
        setLoggedInUsername(userInfo.username);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserInfoAndPosts = useCallback(async () => {
    try {
      const userInfo = await getUserInfoAsync();
      if (userInfo) {
        setLoggedInUsername(userInfo.username);
      }

      const userResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUserByUsername/${username}`
      );
      setUser(userResponse.data);

      const fetchedProfileImage =
        userResponse.data.profileImage || defaultProfileImageUrl;
      setProfileImage(fetchedProfileImage);

      const postsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );

      const sortedPosts = postsResponse.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setPosts(sortedPosts);
      setMediaPosts(
        sortedPosts.filter((post) => post.imageUri || post.videoUri)
      ); // Filter media posts
      setTextPosts(
        sortedPosts.filter((post) => !post.imageUri && !post.videoUri)
      ); // Filter text posts

      const followerResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${username}`
      );
      setFollowerCount(
        followerResponse.data.length > 0
          ? followerResponse.data[0].followers.length
          : 0
      );

      const followingResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/following/${username}`
      );
      setFollowingCount(
        followingResponse.data.length > 0
          ? followingResponse.data[0].following.length
          : 0
      );
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false after data fetching completes
    }
  }, [username]);

  useEffect(() => {
    if (loggedInUsername && user.username) {
      setShouldRenderFollowButton(true);
    }
  }, [loggedInUsername, user.username]);

  const updateFollowerCount = (newFollowerCount) => {
    setFollowerCount(newFollowerCount);
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useLayoutEffect(() => {
    fetchUserInfoAndPosts();
  }, [fetchUserInfoAndPosts]);

  const openPostModal = (index) => {
    setSelectedPostIndex(index);
    setShowPostModal(true);
  };

  const closePostModal = () => {
    setShowPostModal(false);
  };

  const handleMessageBtnClick = () => {
    setTargetChatUser(user);
  };

  if (!loading && (!user || !user.username)) {
    // Show message only if loading is false and user data is missing
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
          <img
            src={profileImage}
            alt="Profile"
            className="object-cover w-40 h-40 rounded-full"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            }}
            onError={(e) => {
              e.target.onerror = null; // Prevents infinite loop if default image fails
              e.target.src = "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png"; // Fallback to default image
            }}
          />
        </div>
        <div className="profile-info">
          <div className="username">{"@" + user.username}</div>

          <div className="flex">
            <div>
              {shouldRenderFollowButton && (
                <FollowButton
                  className="ssu-button-bold"
                  username={loggedInUsername}
                  targetUserId={user.username}
                  onUpdateFollowerCount={updateFollowerCount}
                />
              )}
            </div>
            <div>
              <button
                className="ssu-button-primary py-2 px-3"
                onClick={handleMessageBtnClick}
              >
                Message
              </button>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item hover:scale-125">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat-item hover:scale-125">
              <span className="stat-number">{followerCount}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat-item hover:scale-125">
              <span className="stat-number">{followingCount}</span>
              <span className="stat-label">following</span>
            </div>
          </div>
          <div className="profile-bio">{user.biography}</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={filter === "upload" ? "active" : ""}
          onClick={() => setFilter("upload")}
        >
          <FontAwesomeIcon icon={faCamera} />
        </button>
        <button
          className={filter === "text" ? "active" : ""}
          onClick={() => setFilter("text")}
        >
          <FontAwesomeIcon icon={faLightbulb} />
        </button>
      </div>

      {/* Media Posts Grid */}
      {filter === "upload" && (
        <div className="profile-posts ">
          {mediaPosts.map((post, index) => (
            <div
              key={post.id}
              className="profile-post-item "
              onClick={() => openPostModal(index)}
            >
              {post.imageUri && <img src={post.imageUri} alt="Post" />}
              {post.videoUri && <video src={post.videoUri} controls />}
            </div>
          ))}
        </div>
      )}

      {/* Text Posts List */}
      {filter === "text" && (
        <div className="text-posts-list">
          {textPosts.map((post) => (
            <div key={post.id}>
              <Post posts={post} />
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      <Modal show={showPostModal} onHide={closePostModal}>
        <Modal.Header closeButton>
          <Modal.Title>Posts</Modal.Title>
        </Modal.Header>
        <Modal.Body className="dark:bg-gray-800">
          {mediaPosts.slice(selectedPostIndex).map((post, index) => (
            <div key={post.id} className="modal-post-item dark:bg-gray-800">
              <Post posts={post} />
              <hr />
            </div>
          ))}
        </Modal.Body>
      </Modal>

      <Chat
        targetChatUser={targetChatUser}
        setTargetChatUser={setTargetChatUser}
      />
    </div>
  );
}
