import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwt";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";
import axios from "axios";
import { DarkModeProvider } from "../DarkModeContext";

import { useDarkMode } from '../DarkModeContext';

const Post = ({ posts }) => {
  const [likeCount, setLikeCount] = useState(null);
  const [commentCount, setCommentCount] = useState(null); // Comment count state
  const [isLiked, setIsLiked] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // Track if data is loaded
  const formattedDate = moment(posts.date).format("MMMM Do YYYY, h:mm A");
  const { _id: postId } = posts;
  const [user, setUser] = useState(null);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const currentUser = getUserInfoAsync();
    setUser(currentUser);
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

    // Fetch the comment count for the specific post
    fetchCommentCount();
  }, [posts._id]);

  useEffect(() => {
    if (dataLoaded) {
      handleIsLiked();
    }
  }, [dataLoaded]);

  const fetchCommentCount = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/count/comments-for-post/${posts._id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCommentCount(data); // Update the comment count
      })
      .catch((error) => {
        console.error("Error fetching comment count:", error);
      });
  };

  const handleLikeClick = () => {
    if (!user || !user.id) {
      return; // prevents errors when the user is NOT logged in
    }
    const userId = user.id;
    handleIsLiked();
    if (!isLiked) {
      try {
        axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/like`, {
          postId,
          userId,
        });
        handleIsLiked();
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          console.error("Error liking:", error.response.data.message);
        }
      }
    } else {
      try {
        axios
          .delete(`${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/unLike`, {
            data: { postId, userId },
          })
          .then((response) => {
            console.log("Unlike response:", response.data);
            handleIsLiked();
          })
          .catch((error) => {
            console.error("Error unliking:", error);
          });
      } catch (error) {
        console.error("Error unliking:", error);
      }
    }
  };

  const handleIsLiked = async () => {
    if (!user || !user.id) {
      return; // prevents errors when the user is NOT logged in
    }
    const userId = user.id;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user-likes/${userId}`
      );
      const userLikes = response.data;
      const postLiked = userLikes.find((likes) => likes.postId === postId);

      if (postLiked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Error checking user likes:", error);
    }
  };

  return (
    <div className="d-inline-flex p-2">
      <Card
        id="postCard"
        style={{ backgroundColor: darkMode ? "#181818" : "#f6f8fa" }}
      >
        <Card.Body>
          <Link
            id="username"
            style={{ color: darkMode ? "white" : "" }}
            to={`/publicprofilepage/${posts.username}`}
          >
            {posts.username}
          </Link>
          <Card.Text style={{ color: darkMode ? "white" : "" }}>
            {posts.content}
          </Card.Text>
          <div className="text-center">
            <Button
              variant={isLiked ? "danger" : "outline-danger"}
              onMouseOver={handleIsLiked}
              onClick={handleLikeClick}
            >
              {isLiked ? "Unlike" : "Like"}
            </Button>
          </div>
          <p style={{ color: darkMode ? "white" : "" }}>{formattedDate}</p>
          {likeCount !== null && (
            <p style={{ color: darkMode ? "white" : "" }}>
              {`Likes: ${likeCount}`}
            </p>
          )}
          <Link
            style={{ marginRight: "1cm" }}
            to={`/updatePost/${posts._id}`}
            className="btn btn-warning"
          >
            Update
          </Link>

          <Link
            to={`/createComment/${posts._id}`}
            className="btn btn-warning"
          >
            Comment ({commentCount > 0 ? commentCount : "0"})
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Post;
