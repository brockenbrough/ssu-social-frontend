import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwt";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";
import axios from "axios";
import { useDarkMode } from "../DarkModeContext";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import timeAgo from "../../utilities/timeAgo";
import CreateComment from "../comments/createComment";

const Post = ({ posts }) => {
  const [youtubeThumbnail, setYoutubeThumbnail] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const formattedDate = moment(posts.date).format("h:mm A - M/D/YYYY");
  const { _id: postId } = posts;
  const [user, setUser] = useState(null);
  const { darkMode } = useDarkMode();
  const isCurrentUserPost = user && user.username === posts.username;
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedPost, setEditedPost] = useState({ content: posts.content });
  const [showCommentCard, setShowCommentCard] = useState(false);
  const postCardRef = useRef(null);
  const [postCardHeight, setPostCardHeight] = useState(0);

  const handleShowPostModal = () => {
    setShowCommentCard(!showCommentCard);
  };

  const hasMedia = !!(posts.imageUri || youtubeThumbnail);

  const rendercontent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (index % 2 === 1) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    if (postCardRef.current) {
      const postCardRect = postCardRef.current.getBoundingClientRect();
      setPostCardHeight(postCardRect.height);
    }
  }, [posts]);

  const displayContent = rendercontent(posts.content);

  useEffect(() => {
    const currentUser = getUserInfoAsync();
    setUser(currentUser);
    fetchLikeCount();
    fetchCommentCount();
  }, [posts._id]);

  const fetchLikeCount = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/count/likes-for-post/${posts._id}`
    )
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
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/count/comments-for-post/${posts._id}`
    )
      .then((response) => response.json())
      .then((data) => setCommentCount(data))
      .catch((error) => console.error("Error fetching comment count:", error));
  };

  useEffect(() => {
    if (dataLoaded) {
      handleIsLiked();
    }
  }, [dataLoaded]);

  const fetchYouTubeThumbnail = async (videoId) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyAV6-k-24JeM4Lmd3Q5V3n-5YK1hxEtmU4`
      );
      const thumbnailUrl =
        response.data.items[0]?.snippet?.thumbnails?.medium?.url;
      setYoutubeThumbnail(thumbnailUrl || "");
    } catch (error) {
      console.error("Error fetching YouTube video data:", error);
    }
  };

  useEffect(() => {
    if (posts.content) {
      const youtubeRegex =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const youtubeMatch = posts.content.match(youtubeRegex);

      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        fetchYouTubeThumbnail(videoId);
      }
    }
  }, [posts.content]);

  const handleLikeClick = (e) => {
    e.stopPropagation();

    if (!user || !user.id) return;

    const userId = user.id;
    if (!isLiked) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/like`, {
          postId,
          userId,
        })
        .then(() => {
          setLikeCount((prevCount) => prevCount + 1);
          setIsLiked(true);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
          ) {
            console.error("Error liking:", error.response.data.message);
          }
        });
    } else {
      axios
        .delete(`${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/unLike`, {
          data: { postId, userId },
        })
        .then(() => {
          setLikeCount((prevCount) => prevCount - 1);
          setIsLiked(false);
        })
        .catch((error) => console.error("Error unliking:", error));
    }
  };

  const handleIsLiked = async () => {
    if (!user || !user.id) return;

    const userId = user.id;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user-likes/${userId}`
      );
      const userLikes = response.data;
      const postLiked = userLikes.find((likes) => likes.postId === postId);
      setIsLiked(!!postLiked);
    } catch (error) {
      console.error("Error checking user likes:", error);
    }
  };

  const handleShowEditModal = () => {
    if (isCurrentUserPost) {
      setEditedPost({ content: posts.content });
      setShowEditModal(true);
    } else {
      alert("You don't have permission to edit this post.");
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditPost = () => {
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/updatePost/${posts._id}`,
        {
          content: editedPost.content,
        }
      )
      .then((response) => {
        handleCloseEditModal();
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDeletePost = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/deletePost/${posts._id}`
      )
      .then((response) => {
        handleCloseEditModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="position-relative" style={{ width: "100%" }}>
      <div className="d-flex justify-content-center p-2" style={{ width: "100%" }}>
        <div className={`ssu-post-card ${darkMode ? "dark" : ""}`} >
          <div>
            {/*  image */}
            {posts.imageUri && (
              <img
                src={posts.imageUri}
                alt="Post"
                className="ssu-post-img"
              />
            )}
            {/*  author of post */}
            <a
              href={isCurrentUserPost ? "/privateUserProfile" : `/publicProfilePage/${posts.username}`}
              className="ssu-textlink-bold" style={{ color: darkMode ? "white" : "black" }}
            >
              @{posts.username}
            </a>
            {/* post text */}
            <p className="ssu-text-normalsmall" style={{ color: darkMode ? "white" : "black" }}>
              {displayContent}
            </p>

            {/* YouTube Thumbnail */}
            {youtubeThumbnail && (
              <div>
                <br />
                <img
                  alt="YouTube Video Thumbnail"
                  src={youtubeThumbnail}
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "100%",
                    maxHeight: "350px",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
            )}

            {/* Like and comment buttons */}
            <button onClick={handleLikeClick} className="ssu-button-info-clickable" >
              {isLiked ? "♥" : "♡"} <span>{` ${likeCount}`}</span>
            </button>
            <button onClick={handleShowPostModal} className="ssu-button-info-clickable">
              {showCommentCard ? "Hide Comments" : `💬 ${commentCount > 0 ? commentCount : "0"}`}
            </button>
            {/* Edit button */}
            {isCurrentUserPost && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop the click event from reaching the parent Card
                  handleShowEditModal();
                }}
                className="ssu-button-primary"
              >
                Edit
              </button>
            )}
            {/* Post date */}
            <p style={{ marginTop: "4px" }}>
              <span style={{ marginRight: "15px", fontSize: "0.8rem" }}>{formattedDate}</span>
              <span style={{ fontSize: "0.8rem" }}>{timeAgo(posts.date)}</span>
            </p>
          </div>
        </div>
        {/* Comment Section */}
        {showCommentCard && (
          <div style={{ position: "absolute", left: "calc(50% + 270px)" }}>
            <Card
              style={{
                width: "360px",
                height: hasMedia ? "600px" : `${postCardHeight}px`,
                paddingBottom: hasMedia ? "0px" : "10px",
                backgroundColor: darkMode ? "#181818" : "#f6f8fa",
              }}
            >
              <Card.Body style={{ color: darkMode ? "white" : "black" }}>
                <CreateComment
                  postId={postId}
                  setParentCommentCount={setCommentCount}
                  postCardHeight={postCardHeight}
                  hasMedia={hasMedia}
                />
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: darkMode ? "#181818" : "#f6f8fa",
            color: darkMode ? "white" : "black",
          }}
        >
          <Modal.Title style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}>
            Would you like to update or delete your post?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}>
          {/*  'Edit' Image Styling */}
          {posts.imageUri && (
            <img
              src={posts.imageUri}
              alt="Post"
              style={{
                width: "auto",
                maxWidth: "400px",
                height: "auto",
                maxHeight: "280px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto 14px auto",
              }}
            />
          )}
          <Form>
            <Form.Group controlId="editPostContent">
              <Form.Control
                as="textarea"
                rows={3}
                value={editedPost.content}
                onChange={(e) => setEditedPost({ content: e.target.value })}
                style={{
                  backgroundColor: darkMode ? "#181818" : "#f6f8fa",
                  color: darkMode ? "white" : "black",
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}>
          <Button variant="danger" onClick={handleDeletePost}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditPost}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Post;