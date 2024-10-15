import React, { useState, useEffect, useContext, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";
import { useDarkMode } from '../DarkModeContext.js';
import PostList from "../post/postlist";
import EditUser from './editUserPage.js';
import ProfileImage from "../images/ProfileImage.js";
import UploadImages from "../images/uploadImages.js";

const PrivateUserProfile = () => {
  const { darkMode } = useDarkMode();

  // State for toggling sidebar menu
 const [showMenu, setShowMenu] = useState(false);

  // State for showing delete confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleShowDeleteConfirmation = () => setShowDeleteConfirmation(true);

  // State for showing logout confirmation modal
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const handleCloseLogoutConfirmation = () => setShowLogoutConfirmation(false);
  const handleShowLogoutConfirmation = () => setShowLogoutConfirmation(true);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const handleCloseUploadModal = () => setShowUploadModal(false);
  const handleShowUploadModal = () => setShowUploadModal(true);

  
  const [totalLikes, setTotalLikes] = useState(0); 

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImageFilename, setProfileImageFilename] = useState("");
  const [userProfileImage, setUserProfileImage] = useState("");

  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Function to open the post modal
  const openPostModal = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  // Function to close the post modal
  const closePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  const onFileChange = event => {
    setSelectedFile(event.target.files[0]);
};


const onUpload = async () => {
  if (selectedFile) {
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      console.log('Username:', username);
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/updateProfileImage/${username}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUserProfileImage(res.data.filePath);  // Update the profile image in the state
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  } else {
    console.error("No files selected");
  }
};


const profileImageUrl = profileImageFilename ? `./routes/users/user.images/image/${profileImageFilename}` : null;
 
  // Fetch the user context
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  // State for the form to create a new post
  const [form, setForm] = useState({ content: "" });

  // State to store user's posts
  const [posts, setPosts] = useState([]);

  
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Used for navigation
  const navigate = useNavigate();

  // State for the post to be deleted
  const [postToDelete, setPostToDelete] = useState(null);

  // Function to open the delete confirmation modal
  const openDeleteModal = (post) => {
    setPostToDelete(post);
    handleShowDeleteConfirmation();
  };

  // Function to navigate to follower list
  const followerRouteChange = () => {
    navigate(`/followers/${username}`);
  };

  // Function to navigate to following list
  const followingRouteChange = () => {
    navigate(`/following/${username}`);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfoAsync();
      if (userInfo) {
        setUser(userInfo);
        setUsername(userInfo.username);
        setUserId(userInfo.id);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Fetch user info
  }, []);

  const fetchFollowerCount = async () => {
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
  };

  // Function to fetch following count
  const fetchFollowingCount = async () => {
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
  };

  const fetchTotalLikes = async () => {
    try {
      console.log(username);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user-totallikes/${username}`
      );
    setTotalLikes(res.data);
  } catch (error) {
    console.error("Error fetching total likes:", error);
  }
  }; 

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );
      setPosts(res.data);
    } catch (error) {
      alert(
        `Unable to get posts from ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`
      );
    }
  }, [username]); // Include only the username as a dependency

  // Fetch user's posts when the component mounts and when username changes

  // Handle changes in the form input
  const handleChange = (event) => {
    const { id, value } = event.target;
    setForm({ ...form, [id]: value });
  };

  // Handle the submission of a new post
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { content } = form;
    const newPost = { content, username };
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`,
        newPost
      );
      fetchPosts();
      setForm({ content: "" });
    } catch (error) {
      alert(
        `Unable to create post: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`
      );
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchFollowerCount(); // Fetch follower count
    fetchFollowingCount(); // Fetch following count
    fetchTotalLikes();
  }, [username, fetchPosts]); // Include username and fetchPosts as dependencies
 

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

  useEffect(() => {
    
    async function fetchProfileImage() {
      try {
        // Get the filename associated with the user
        const response = await axios.get(`/some-endpoint-to-get-filename/${username}`);
        const filename = response.data.filename;
  
        // Now use the filename to get the image
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/profileImage/${filename}`);
        setUserProfileImage(res.data.filePath);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    }
    
  
    fetchProfileImage();
  }, [username]);
  ; // Include username and fetchTotalLikes as dependencies

  const [ userModal, setUserModal ] = useState(false);
  const showUserModal = () => {
    setUserModal(true);
  };
  
  const closeUserModal = () => {
    setUserModal(false);
  }
  
// Toggle sidebar menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="ssu-profilePage-container">
      <button onClick={toggleMenu} className="toggle-button">
       &#x22EE; {/* Three dots button */}
     </button>
      {/* Left Sidebar Menu */}
     {showMenu && (
       <div className={`side-menu ${showMenu ? "open" : ""}`}>
         <button onClick={() => userModal(true)} className="menu-item">
           Account Settings
         </button>
         <button className="menu-item">Personal Information</button>
         <button onClick={() => handleShowLogoutConfirmation(true)} className="ssu-button-primary">
           log Out
         </button>
       </div>
     )}

      {user ? (
         <>
         <div className="profile-header">
           <div className="profile-image">
             <ProfileImage />
             <Button onClick={UploadImages}>Upload Profile Image</Button>
           </div>
           <div className="profile-info">
             <div className="username">{user.username}</div>
             <button onClick={showUserModal} class="edit-profile-btn" >
               edit profile
             </button>
             <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">posts</span>
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
             <div className="profile-bio">{user.bio}</div>
             </div>
             </div>
             
          {/* Post Grid */}
          <div className="profile-posts">
            {posts.map((post, index) => (
              <div key={index} className="profile-post-item" onClick={() => openPostModal(post)}>
                {post.image ? (
                  <img src={post.image} alt={`Post by ${post.username}`} />
                ) : (
                  <p>{post.content}</p>
                )}
              </div>
            ))}
          </div>
        </>
     
      ) : (
        <div className="text-center col-md-12" style={{ fontSize: '24px', fontWeight: 'bold' }}>
          <p>
            Please <Link to="/" style={{ textDecoration: 'underline' }}>log in</Link> to view your profile.
          </p>
        </div>
      )}
      
      <Modal
               show={showLogoutConfirmation}
               onHide={handleCloseLogoutConfirmation}
               backdrop="static"
               keyboard={false}
             >
               <Modal.Header closeButton style={{
                   background: darkMode ? '#181818' : 'white',
                   color: darkMode ? 'white' : 'black',
                 }}>
                 <Modal.Title>log out</Modal.Title>
               </Modal.Header>
               <Modal.Body style={{
                   background: darkMode ? '#181818' : 'white',
                   color: darkMode ? 'white' : 'black',
                 }}>Are you sure you want to log out?</Modal.Body>
               <Modal.Footer style={{
                   background: darkMode ? '#181818' : 'white',
                   color: darkMode ? 'white' : 'black',
                 }}>
                 <button variant="secondary" onClick={handleCloseLogoutConfirmation} class="ssu-button-primary">
                   No
                 </button>
                 <button variant="primary" onClick={handleLogout} class="ssu-button-primary">
                   Yes
                 </button>
               </Modal.Footer>
             </Modal>
             
      <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
            No
          </Button>
          <Button variant="primary" onClick={deleteConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={onFileChange} />
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Profile"
              style={{ width: '100%', marginTop: '10px' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUploadModal}>
            Close
          </Button>
          <Button onClick={onUpload}>Upload Profile Image</Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showPostModal} onHide={closePostModal}>
        <Modal.Header closeButton>
          <Modal.Title>Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <div>
              <p>Username: {selectedPost.username}</p>
              <p>{selectedPost.content}</p>
              <p>{moment(selectedPost.date).format("MMMM Do YYYY, h:mm A")}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePostModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={userModal} onHide={closeUserModal}>
       <Modal.Header closeButton>
         <Modal.Title>Edit Profile</Modal.Title>
       </Modal.Header>
       <Modal.Body>
         <EditUser />
       </Modal.Body>
     </Modal>
      
    </div>
  );
};

export default PrivateUserProfile;