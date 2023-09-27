import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";
import "./postStyles.css";

const Post = ({ posts }) => {
  const [likeCount, setLikeCount] = useState(null);
  const [viewCount, setViewCount] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const formattedDate = moment(posts.date).format("MMMM Do YYYY, h:mm A");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/count/likes-for-post/${posts._id}`)
      .then((response) => response.json())
      .then((data) => {
        setLikeCount(data); // Contain the like count from the API response (Someone will do this)
      })
      .catch((error) => {
        console.error("Error fetching like count:", error);
      });
      fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/views/${posts._id}`)  
      .then((response) => response.json())
      .then((data) => {
       console.log("API Response:", data); // 
        setViewCount(data);
        
      })
      .catch((error) => {
        console.error("Error fetching view count:", error);
      });
  }, [posts._id]);
  
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  

  return (
    <div className="d-inline-flex p-2">
      <Card id="fullCard" style={{ width: "18rem" }}>
        <Card.Body>
          <Link to={`/publicprofilepage/${posts.username}`} id="username">
            {posts.username}
          </Link>
          <Card.Text>{posts.content}</Card.Text>
          <div class="text-center" id="likeButton">
            <Button
              variant={isLiked ? "danger" : "outline-danger"}
              onClick={handleLikeClick}
            >
              {isLiked ? 'Unlike' : 'Like'}
            </Button>
          </div>
          <p>{formattedDate}</p> {/* Display formattedDate */}
          {likeCount !== null && (
            <p>{`Likes: ${likeCount}`}</p> // Display likeCount if it's not null
          )}
          {viewCount !== null && (
            <p>{`Views: ${viewCount}`}</p> // Display viewCount if it's not null
          )}
          <Link
            style={{ marginRight: "1cm" }}
            to={`/updatePost/${posts._id}`}
            className="btn btn-warning"
          >
            Update
          </Link>
          <Link to="/createComment" style={{ marginRight: "1cm" }} className="btn btn-warning">
            Comment
          </Link>

        </Card.Body>
      </Card>
    </div>
  );
};

export default Post;
