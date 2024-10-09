import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
} from "react";
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
import { PostPageContext } from "../../App";
import apiClient from "../../utilities/apiClient";

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
  const [postPage, setPostPage] = useContext(PostPageContext);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);

  const handleShowPostModal = () => {
    if (showCommentCard) {
      setIsSlidingOut(true);
      setTimeout(() => {
        setIsAnimationActive(false);
        setShowCommentCard(false);
        setIsSlidingOut(false);
      }, 300); //Animation durration delay (0.3 ms)
    } else {
      setIsAnimationActive(true);
      setShowCommentCard(true);
    }
  };

  const hasMedia = !!(posts.imageUri || youtubeThumbnail);

  const rendercontent = (content) => {
    if (!content) return content;
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

  useLayoutEffect(() => {
    const postCardElement = postCardRef.current;
    if (postCardElement) {
      const postCardRect = postCardElement.getBoundingClientRect();
      setPostCardHeight(postCardRect.height);
    }
  }, [posts, commentCount, showCommentCard]);

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

  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleLikeClick = async (e) => {
    e.stopPropagation();

    if (!user || !user.id || isLoading) return; // Prevent action if no user or loading

    const userId = user.id;
    setIsLoading(true); // Set loading state to true

    try {
      if (!isLiked) {
        // If not liked, send the like request
        await axios.post(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/like`,
          {
            postId,
            userId,
          }
        );
        setLikeCount((prevCount) => prevCount + 1); // Increment like count
        setIsLiked(true); // Update isLiked to true
      } else {
        // If already liked, send the unlike request
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/unLike`,
          {
            data: { postId, userId },
          }
        );
        setLikeCount((prevCount) => Math.max(prevCount - 1, 0)); // Decrement like count, prevent negative
        setIsLiked(false); // Update isLiked to false
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        console.error("Error liking/unliking:", error.response.data.message);
      }
    } finally {
      setIsLoading(false); // Reset loading state
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
    apiClient
      .delete(`/posts/deletePost/${posts._id}`)
      .then((response) => {
        handleCloseEditModal();
        setPostPage(0); // this signals postlist to redisplay it's list.
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="position-relative" style={{ width: "100%" }}>
      <div
        className="d-flex justify-content-center margin: 0, padding: 0"
        style={{ width: "100%" }}
      >
        <div ref={postCardRef} className="ssu-post-card">
          <div>
            {/*  author of post */}
            <a
              href={
                isCurrentUserPost
                  ? "/privateUserProfile"
                  : `/publicProfilePage/${posts.username}`
              }
              className="ssu-textlink-bold"
            >
              @{posts.username}
            </a>
            {/* post text */}
            <p className="ssu-text-normalsmall">{displayContent}</p>
            {/*  image */}
            {posts.imageUri && (
              <img src={posts.imageUri} alt="Post" className="ssu-post-img" />
            )}

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
            <button onClick={handleLikeClick} className="mr-3">
              {isLiked ? "♥" : "♡"} <span>{` ${likeCount}`}</span>
            </button>
            <button onClick={handleShowPostModal}>
              {`💬 ${commentCount > 0 ? commentCount : "0"}`}
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
            <p className="ssu-text-tinyright">
              {formattedDate} {timeAgo(posts.date)}
            </p>
          </div>
        </div>
        {/* Comment Section */}
        {showCommentCard && (
          <div
            style={{ position: "absolute", left: "calc(50% + 200px)" }}
            className={
              isAnimationActive &&
              (showCommentCard && !isSlidingOut
                ? "animate-slide-in-left"
                : "animate-slide-out-left")
            }
          >
            <Card
              style={{
                width: "360px",
                height: `${postCardHeight}px`,
                backgroundColor: darkMode ? "#181818" : "#f6f8fa",
              }}
              className="shadow-lg rounded-lg"
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
          <Modal.Title
            style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}
          >
            Would you like to update or delete your post?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}
        >
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Post;
