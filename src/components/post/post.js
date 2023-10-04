import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import "./postStyles.css";

const Post = ({ posts }) => {
  const [likeCount, setLikeCount] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const formattedDate = moment(posts.date).format("MMMM Do YYYY, h:mm A");
  const { _id: postId } = posts;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUserInfo();
    setUser(currentUser);
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/count/likes-for-post/${posts._id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLikeCount(data);
      })
      .catch((error) => {
        console.error("Error fetching like count:", error);
      });
  }, [posts._id]);

  const handleLikeClick = () => {
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
      <Card id="postCard" style={{ width: "18rem" }}>
        <Card.Body>
          <Link id="username" to={`/publicprofilepage/${posts.username}`}>
            {posts.username}
          </Link>
          <Card.Text>{posts.content}</Card.Text>
          <div className="text-center">
            <Button
              variant={isLiked ? "danger" : "outline-danger"}
              onPrint={handleIsLiked}
              onMouseOver={handleIsLiked}
              onClick={handleLikeClick}
            >
              {isLiked ? "Unlike" : "Like"}
            </Button>
          </div>
          <p>{formattedDate}</p>
          {likeCount !== null && (
            <p>{`Likes: ${likeCount}`}</p>
          )}
          <Link
            style={{ marginRight: "1cm" }}
            to={`/updatePost/${posts._id}`}
            className="btn btn-warning"
          >
            Update
          </Link>

          {/* Clickable Comment Icon */}
          <Link to="/comments/comment" style={{ marginRight: "10px" }}>
            <FontAwesomeIcon icon={faComment} />
          </Link>

          <Link to="/createComment" className="btn btn-warning">
            Comment
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Post;
