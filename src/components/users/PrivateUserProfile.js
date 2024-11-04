import React, { useState, useEffect, useCallback, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";
import { useDarkMode } from "../DarkModeContext.js";
import PostList from "../post/postlist";
import EditUserBio from './editUserBio.js';
import ProfileImage from "../images/ProfileImage.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeartIcon, faComment as solidCommentIcon } from "@fortawesome/free-solid-svg-icons";
import { faPhotoVideo, faAlignLeft } from "@fortawesome/free-solid-svg-icons"
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faTh } from "@fortawesome/free-solid-svg-icons"; // Grid icon (9 small squares)
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Post from "../post/post.js"

const PrivateUserProfile = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();

  // State for sidebar menu
  const [showMenu, setShowMenu] = useState(false);

  // State for delete confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleShowDeleteConfirmation = () => setShowDeleteConfirmation(true);

  // State for logout confirmation modal
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const handleCloseLogoutConfirmation = () => setShowLogoutConfirmation(false);
  const handleShowLogoutConfirmation = () => setShowLogoutConfirmation(true);

  // State for profile image upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const handleCloseUploadModal = () => setShowUploadModal(false);
  const handleShowUploadModal = () => setShowUploadModal(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState("/defaultProfile.png");
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const fileInputRef = useRef(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const [filter, setFilter] = useState("upload");



  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfoAsync();
      if (userInfo) {
        setUser(userInfo);
        setUsername(userInfo.username);

        // Fetch user data including biography and profileImage
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUserByUsername/${userInfo.username}`);
        
        const defaultProfileImageUrl = "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";
        
        // Use fetched profile image if available, otherwise use default
        const fetchedProfileImage = res.data.profileImage ? res.data.profileImage : defaultProfileImageUrl;
        setUserProfileImage(fetchedProfileImage);
        
        // Ensure biography is part of the fetched user data
        if (res.data.biography) {
          setUser((prevUser) => ({
            ...prevUser,
            biography: res.data.biography,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };  

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Fetch posts, followers, and following counts
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`);
      setPosts(res.data);
    } catch (error) {
      alert(`Unable to get posts: ${error.message}`);
    }
  }, [username]);

  const fetchFollowerCount = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${username}`);
      setFollowerCount(response.data.length > 0 ? response.data[0].followers.length : 0);
    } catch (error) {
      console.error(`Error fetching follower count: ${error.message}`);
    }
  };

  const fetchFollowingCount = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/following/${username}`);
      setFollowingCount(response.data.length > 0 ? response.data[0].following.length : 0);
    } catch (error) {
      console.error(`Error fetching following count: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFollowerCount();
    fetchFollowingCount();
  }, [username, fetchPosts]);

  // Profile image upload
  const onFileChange = (event) => {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
  
    if (file && validImageTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid image file.');
      event.target.value = ''; // Clear the invalid file selection
    }
  };

  const deleteConfirm = async () => {
    if (postToDelete) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/deletePost/${postToDelete._id}`
        );
        handleCloseDeleteConfirmation();
        fetchPosts();
      } catch (error) {
        alert(
          `Unable to delete post: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/deletePost/${postToDelete._id}`
        );
      }
    }
  };

  const saveProfileImageAndGetUri = async () => {
    const formData = new FormData();
    formData.append("profileImage", selectedFile);
    formData.append("name", username);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/profile/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const { imageUri } = response.data;
        return imageUri;
      } else {
        alert("Image was not saved. HTTP status code: " + response.status);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    return null;
  };

  const onUpload = async () => {
    if (selectedFile) {
      const imageUri = await saveProfileImageAndGetUri();
      if (imageUri) {
        setUserProfileImage(imageUri);
        setShowUploadModal(false);
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  // Profile image removal
  const removeImage = () => {
    setSelectedFile(null);
    fileInputRef.current.value = "";
  };

  // New function to remove profile image
  const removeProfileImage = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/profile/remove`, {
        name: username,
      });

      if (response.status === 200) {
        setUserProfileImage(response.data.profileImage);  // Set the default profile picture
        setShowUploadModal(false);  // Close the modal after removal
      } else {
        alert('Failed to remove profile image.');
      }
    } catch (error) {
      console.error('Error removing profile image:', error);
      alert('An error occurred while removing the profile picture.');
    }
  };

  // Modal to show a selected post
  const openPostModal = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const closePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  // Follower and following navigation
  const followerRouteChange = () => {
    navigate(`/followers/${username}`);
  };

  const followingRouteChange = () => {
    navigate(`/following/${username}`);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Sidebar menu toggle
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Edit user modal
  const [userModal, setUserModal] = useState(false);
  const showUserModal = () => {
    setUserModal(true);
  };

  const closeUserModal = () => {
    setUserModal(false);
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'text') {
      return !post.imageUri && !post.videoUri && !post.link;
    }
     return post.imageUri || post.videoUri || post.link;
   });
   
  // Function to handle post click
const handlePostClick = (index) => { 
  setSelectedPostIndex(index);       
  setShowPostModal(true);            
  };  
  
const mediaPosts = posts.filter(post => post.imageUri || post.videoUri);
const textPosts = posts.filter(post => !post.imageUri && !post.videoUri  && !post.link);


const filterButtons = (
 <div className="filter-buttons">
   <button
     className={filter === 'upload' ? 'active' : ''}
     onClick={() => setFilter('upload')}
   >
     <FontAwesomeIcon icon={faCamera} /> Media
   </button>
   <button
     className={filter === 'text' ? 'active' : ''}
     onClick={() => setFilter('text')}
   >
     <FontAwesomeIcon icon={faAlignLeft} /> Text
   </button>
 </div>
);

  return (
    <div className="ssu-profilePage-container">
      <button onClick={toggleMenu} className="toggle-button">&#x22EE;</button>
      {showMenu && (
        <div className={`side-menu ${showMenu ? "open" : ""}`}>
          <button className="menu-item" onClick={showUserModal}>Account Settings</button>
          <button className="menu-item">Personal Information</button>
          <button onClick={handleShowLogoutConfirmation} className="ssu-button-primary">log out</button>
        </div>
      )}

      {user ? (
        <>
          <div className="profile-header">
            <div className="profile-image">
              <img
                src={userProfileImage}
                alt="Profile"
                onClick={handleShowUploadModal}
                className="object-cover w-40 h-40 rounded-full cursor-pointer"
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              />
            </div>
            <div className="profile-info">
              <div className="username">{"@" + user.username}</div>
              <button className="edit-profile-btn" onClick={showUserModal}>edit bio </button>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{posts.length}</span>
                  <span className="stat-label">
                    {posts.length === 1 ? "post" : "posts"}
                  </span>
                </div>
                <div className="stat-item" onClick={followerRouteChange} style={{ cursor: 'pointer' }}>
                  <span className="stat-number">{followerCount}</span>
                  <span className="stat-label">followers</span>
                </div>
                <div className="stat-item" onClick={followingRouteChange} style={{ cursor: 'pointer' }}>
                  <span className="stat-number">{followingCount}</span>
                  <span className="stat-label">following</span>
                </div>
              </div>
              <div className="profile-bio">{user.biography}</div>
            </div>
          </div>

          {/* Post List */}
       <div className="filter-buttons">
       <button
            className={filter === 'upload' ? 'active' : ''}
            onClick={() => setFilter('upload')} >
            <FontAwesomeIcon icon={faCamera} />
        </button>
        <button
          className={filter === 'text' ? 'active' : ''} onClick={() => setFilter('text')} > <FontAwesomeIcon icon={faLightbulb} />
        </button>
        </div>


      {/* Media Posts Grid */}
     {filter === "upload" && (
     <div className="profile-posts">
     {mediaPosts.map((post, index) => (
       <div key={post.id} className="profile-post-item" onClick={() => openPostModal(index)} >
       {post.imageUri && <img src={post.imageUri} alt="Post" />}
       {post.videoUri && <video src={post.videoUri} controls />}
     </div>
     ))}
     </div>
     )}


   {/* Text Posts List */}
   {filter === "text" && (
   <div className="text-posts-list">
   {textPosts.map(post => (
     <div key={post.id} >
       <Post posts={post}  />
     </div>
     ))}
   </div>
 )}


          {/* Post Modal */}
      {/* Modal to display posts starting from the clicked one */}
      <Modal show={showPostModal} onHide={closePostModal}> 
      <Modal.Header closeButton>                  
      <Modal.Title>Posts</Modal.Title>           
      </Modal.Header>                              
      <Modal.Body>                                 
      {mediaPosts.slice(selectedPostIndex).map((post, index) => ( 
      <div key={post.id} className="modal-post-item">   
      <Post posts={post}  />
      <hr />                                               
    </div>
  ))}
</Modal.Body>                                             
<Modal.Footer>                                            
  <Button variant="secondary" onClick={closePostModal}>Close</Button>
</Modal.Footer>                                            
</Modal>

          {/* Edit Bio Modal */}
          <Modal show={userModal} onHide={closeUserModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Bio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditUserBio />
            </Modal.Body>
          </Modal>

          {/* Profile Image Upload Modal */}
          <Modal show={showUploadModal} onHide={handleCloseUploadModal} centered>
            <div
              className="popup"
              style={{
                backgroundColor: darkMode ? "#181818" : "#fff",
                color: darkMode ? "#fff" : "#000",
              }}
            >
              <Modal.Header closeButton closeVariant={darkMode ? "white" : "black"}>
                <Modal.Title>Change Profile Picture</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ paddingBottom: "0" }}> {/* Adjusted padding to remove white line */}
                <div onClick={() => fileInputRef.current.click()} style={{ marginBottom: "15px", textAlign: "center" }}>
                  <img
                    src={darkMode ? "/addImageLight.png" : "/add-img-icon.png"}
                    alt="Add Image Icon"
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                  />
                </div>

                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={onFileChange}
                  style={{ display: "none" }}
                />

                {selectedFile && (
                  <div className="image-preview-container">
                    <img
                      id="imagePreview"
                      alt="Selected Profile"
                      className="image-preview"
                      src={URL.createObjectURL(selectedFile)}
                    />
                    <button
                      type="button"
                      className="delete-image-button"
                      onClick={removeImage}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer style={{ borderTop: "none" }}>
                <Button
                  onClick={onUpload}
                  disabled={!selectedFile}
                  className="w-full p-2 text-white bg-orange-600 rounded-md"
                >
                  Upload Profile Image
                </Button>
                <Button
                  variant="danger"
                  onClick={removeProfileImage}  // Call the remove function here
                  className="w-full p-2 mt-2 text-white rounded-md"
                >
                  Remove Current Picture
                </Button>
              </Modal.Footer>
            </div>
          </Modal>

          {/* Delete Post Confirmation Modal */}
          <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>No</Button>
              <Button variant="primary" onClick={deleteConfirm}>Yes</Button>
            </Modal.Footer>
          </Modal>

          {/* Logout Confirmation Modal */}
          <Modal show={showLogoutConfirmation} onHide={handleCloseLogoutConfirmation} centered>
        <div
        className="popup"
        style={{
        backgroundColor: darkMode ? "#181818" : "#fff",
        color: darkMode ? "#fff" : "#000",
        }}
  >
    <Modal.Header closeButton closeVariant={darkMode ? "white" : "black"}>
      <Modal.Title>Log Out</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Are you sure you want to log out?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant={darkMode ? "light" : "dark"}
        onClick={handleCloseLogoutConfirmation}
      >
        No
      </Button>
      <Button
        variant={darkMode ? "light" : "dark"}
        onClick={handleLogout}
      >
        Yes
      </Button>
    </Modal.Footer>
  </div>
</Modal>
        </>
      ) : (
        <div className="text-center col-md-12">
          <p>Please <Link to="/">log in</Link> to view your profile.</p>
        </div>
      )}
    </div>
  );
};

export default PrivateUserProfile;