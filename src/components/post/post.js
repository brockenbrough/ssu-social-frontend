import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwt";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";
import axios from "axios";
import { useDarkMode } from '../DarkModeContext';
import Modal from "react-bootstrap/Modal";

import CreateComment from "../comments/createComment";

const Post = ({ posts }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [likeCount, setLikeCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const formattedDate = moment(posts.date).format("MMMM Do YYYY, h:mm A");
  const { _id: postId } = posts;
  const [user, setUser] = useState(null);
  const { darkMode } = useDarkMode();
  const [showPostModal, setShowPostModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);  
  const isCurrentUserPost = user && user.username === posts.username;

  const handleShowPostModal = () => setShowPostModal(true);
  const handleClosePostModal = () => setShowPostModal(false);

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const contentCutoff = 96; // Adjust this as needed
  const showExpandCollapseIcon = posts.content.length > contentCutoff;

  // Define a function to return the expand/collapse icon with styles
  const getExpandCollapseIcon = () => {
    const iconStyle = { color: 'gray', fontSize: 'larger' };
    const iconClick = (e) => {
      e.stopPropagation(); // Prevents triggering the Card's onClick
      toggleShowFullText();
    };
    return showFullText ? 
    <span style={iconStyle} onClick={iconClick}> [^]</span> : 
      <span style={iconStyle} onClick={iconClick}> [...]</span>;
  };

  // Determine which content to display based on the 'showFullText' state
  const displayContent = (
    <>
      {showFullText ? posts.content : `${posts.content.slice(0, contentCutoff)}`}
      {showExpandCollapseIcon && getExpandCollapseIcon()}
    </>
  );

  useEffect(() => {
    const currentUser = getUserInfoAsync();
    setUser(currentUser);
    fetchLikeCount();
    fetchCommentCount();
  }, [posts._id]);

  useEffect(() => {
    if (posts.imageId) {
      fetchImage(posts.imageId);
    }
  }, [posts.imageId]);

  const fetchImage = (imageId) => {
    axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/${imageId}`, { responseType: 'arraybuffer' })
      .then(response => {
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        setImageSrc(`data:${response.headers['content-type']};base64,${base64}`);
      })
      .catch(error => console.error("Error fetching image:", error));
  };

  const fetchLikeCount = () => {
    fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/count/likes-for-post/${posts._id}`)
      .then((response) => response.json())
      .then((data) => {
        setLikeCount(data);
        setDataLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching like count:", error);
        setDataLoaded(true);
      });
  };

  const fetchCommentCount = () => {
    fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/count/comments-for-post/${posts._id}`)
      .then((response) => response.json())
      .then((data) => setCommentCount(data))
      .catch((error) => console.error("Error fetching comment count:", error));
  };

  useEffect(() => {
    if (dataLoaded) {
      handleIsLiked();
    }
  }, [dataLoaded]);

  const handleLikeClick = () => {
    if (!user || !user.id) return;

    const userId = user.id;
    if (!isLiked) {
      axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/like`, { postId, userId })
        .then(() => {
          setLikeCount(prevCount => prevCount + 1);
          setIsLiked(true);
        })
        .catch(error => {
          if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            console.error("Error liking:", error.response.data.message);
          }
        });
    } else {
      axios.delete(`${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/unLike`, { data: { postId, userId } })
        .then(() => {
          setLikeCount(prevCount => prevCount - 1);
          setIsLiked(false);
        })
        .catch(error => console.error("Error unliking:", error));
    }
  };

  const handleIsLiked = async () => {
    if (!user || !user.id) return;

    const userId = user.id;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user-likes/${userId}`);
      const userLikes = response.data;
      const postLiked = userLikes.find(likes => likes.postId === postId);
      setIsLiked(!!postLiked);
    } catch (error) {
      console.error("Error checking user likes:", error);
    }
  };

  const rendercontent = (content) => {
    //Find links withing posts.content
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (index % 2===1) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener nonreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="d-inline-flex p-2">
      <Card id="postCard" style={{
        maxWidth: '400px',
        minWidth: '400px',
        backgroundColor: darkMode ? "#181818" : "#f6f8fa"
      }} onClick={handleShowPostModal}>
        <Card.Body style={{ color: darkMode ? "white" : "black" }}>

          <div style={{ marginBottom: '10px' }}>
          <Link
              id="username"
              to={isCurrentUserPost ? '/privateUserProfile' : `/publicProfilePage/${posts.username}`}
            >
              {posts.username}
            </Link>
        <p></p>
        {imageSrc && <img src={imageSrc} alt="Post" style={{ width: '100%', height: 'auto' }} />}
          </div>

          <div style={{ wordBreak: 'break-all' }} onClick={toggleShowFullText}>
            {rendercontent(posts.content)}
          </div>

          <div className="text-center">
            <Button variant={isLiked ? "danger" : "outline-danger"} onClick={handleLikeClick}>
              {isLiked ? "Unlike" : "Like"}
            </Button>
          </div>

          <p>{formattedDate}</p>

          {likeCount !== null && <p>{`Likes: ${likeCount}`}</p>}

          <Link style={{ marginRight: "1cm" }} to={`/updatePost/${posts._id}`} className="btn btn-warning">Update</Link>
          <Link to={`/createComment/${posts._id}`} className="btn btn-warning">Comment ({commentCount > 0 ? commentCount : "0"})</Link>
        </Card.Body>
      </Card>

      <Modal show={showPostModal} onHide={handleClosePostModal}>
      <Modal.Header closeButton>
          <Modal.Title>Post</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
          <p>{posts.content}</p>
          <CreateComment postId={posts._id} />
          <p>{formattedDate}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePostModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Post;


 



