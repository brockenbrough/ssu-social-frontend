import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwt";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";
import axios from "axios";
import { useDarkMode } from "../DarkModeContext";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import CommentModal from "../comments/CommentModal";
import timeAgo from "../../utilities/timeAgo";

const Post = ({ posts }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const formattedDate = moment(posts.date).format("h:mm A - M/D/YYYY");
  const { _id: postId } = posts;
  const [user, setUser] = useState(null);
  const { darkMode } = useDarkMode();
  const [showPostModal, setShowPostModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const isCurrentUserPost = user && user.username === posts.username;
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedPost, setEditedPost] = useState({ content: posts.content });

  const handleShowPostModal = () => setShowPostModal(true);
  const handleClosePostModal = () => setShowPostModal(false);

  const rendercontent = (content) => {
    //Find links within posts.content
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (index % 2 === 1) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener nonreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const contentCutoff = 96; // Adjust this as needed
  const showExpandCollapseIcon = posts.content.length > contentCutoff;

  // Define a function to return the expand/collapse icon with styles
  const getExpandCollapseIcon = () => {
    const iconStyle = { color: "gray", fontSize: "larger" };
    const iconClick = (e) => {
      e.stopPropagation(); // Prevents triggering the Card's onClick
      toggleShowFullText();
    };
    return showFullText ? (
      <span style={iconStyle} onClick={iconClick}>
        {" "}
        [^]
      </span>
    ) : (
      <span style={iconStyle} onClick={iconClick}>
        {" "}
        [...]
      </span>
    );
  };

  // Determine which content to display based on the 'showFullText' state
  const displayContent = (
    <>
      {showFullText
        ? rendercontent(posts.content)
        : rendercontent(posts.content.slice(0, contentCutoff))}
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
    axios
      .get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/${imageId}`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setImageSrc(
          `data:${response.headers["content-type"]};base64,${base64}`
        );
      })
      .catch((error) => console.error("Error fetching image:", error));
  };

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

  const [youtubeThumbnail, setYoutubeThumbnail] = useState(null);

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
      // Check if the post content contains a YouTube link
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
    // Check if the current user is the owner of the post
    if (isCurrentUserPost) {
      setEditedPost({ content: posts.content });

      if (posts.imageId) {
        fetchImage(posts.imageId);
      }

      setShowEditModal(true);
    } else {
      // Display a message or handle the case where the current user is not the owner
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
        console.log(response);
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
        console.log(response);
        handleCloseEditModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="d-inline-flex p-2">
      <Card
        id="postCard"
        style={{
          maxWidth: "400px",
          minWidth: "400px",
          backgroundColor: darkMode ? "#181818" : "#f6f8fa",
        }}
      >
        <Card.Body style={{ color: darkMode ? "white" : "black" }}>
          <div style={{ marginBottom: "10px" }}>
            <Link
              id="username"
              to={
                isCurrentUserPost
                  ? "/privateUserProfile"
                  : `/publicProfilePage/${posts.username}`
              }
              style={{
                color: darkMode ? "white" : "black",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              {posts.username}
            </Link>
            <p></p>
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Post"
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>

          <div
            style={{ wordBreak: "break-all", marginBottom: ".5cm" }}
            onClick={toggleShowFullText}
          >
            {displayContent}
            <br />
          </div>

          {youtubeThumbnail && (
            <div>
              <br />
              <img
                alt="YouTube Video Thumbnail"
                style={{ width: "150px", height: "auto", marginLeft: "20px" }}
                src={youtubeThumbnail}
              />
            </div>
          )}

          <div className="text-left">
            <Button
              variant={isLiked ? "outline-danger" : "outline-danger"}
              onClick={handleLikeClick}
            >
              {isLiked ? "♥" : "♡"} <span>{` ${likeCount}`}</span>
            </Button>
          </div>

          {isCurrentUserPost && (
            <>
              <Button
                style={{
                  marginRight: "1cm",
                  marginTop: ".5cm",
                  marginBottom: ".5cm",
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Stop the click event from reaching the parent Card
                  handleShowEditModal();
                }}
                variant="primary"
              >
                Edit
              </Button>
            </>
          )}

          <Button
            onClick={handleShowPostModal}
            className="btn btn-warning"
            style={{ marginTop: ".5cm", marginBottom: ".5cm" }}
          >
            Comment ({commentCount > 0 ? commentCount : "0"})
          </Button>

          <p>
            <span style={{ marginRight: "15px", fontSize: "0.8rem" }}>
              {formattedDate}
            </span>
            <span style={{ fontSize: "0.8rem" }}>{timeAgo(posts.date)}</span>
          </p>
        </Card.Body>
      </Card>

      <Modal show={showPostModal} onHide={handleClosePostModal}>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: darkMode ? "#181818" : "#f6f8fa",
            color: darkMode ? "white" : "black",
          }}
        >
          <Modal.Title
            style={{
              backgroundColor: darkMode ? "#181818" : "#f6f8fa",
              color: darkMode ? "white" : "black",
            }}
          >
            Post
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            backgroundColor: darkMode ? "#181818" : "#f6f8fa",
            color: darkMode ? "white" : "black",
          }}
        >
          <p style={{ fontSize: "1.2rem" }}>{posts.content}</p>
          <p>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              @{posts.username}
            </span>
            <span style={{ fontSize: "0.8rem", marginRight: "15px" }}>
              {formattedDate}
            </span>
            <span style={{ fontSize: "0.8rem" }}>{timeAgo(posts.date)}</span>
          </p>
          <CommentModal postId={posts._id} setCommentCount={setCommentCount} />
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: darkMode ? "#181818" : "#f6f8fa",
            color: darkMode ? "white" : "black",
          }}
        >
          <Button variant="secondary" onClick={handleClosePostModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: darkMode ? "#181818" : "#f6f8fa",
            color: darkMode ? "white" : "black",
          }}
        >
          <Modal.Title
            style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}
          >
            Would you like to update or delete your post?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Post"
              style={{ width: "100%", height: "auto" }}
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
        <Modal.Footer
          style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}
        >
          <Button variant="danger" onClick={handleDeletePost}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditPost}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Post;
