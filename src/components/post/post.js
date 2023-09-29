import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import getUserInfo from '../../utilities/decodeJwt';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";
import axios from "axios"; // Import Axios

const Post = ({ posts }) => {
  const [likeCount, setLikeCount] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const formattedDate = moment(posts.date).format("MMMM Do YYYY, h:mm A");
  const { _id: postId } = posts;
  const [user, setUser] = useState(null);

  //function to count likes on a post
  useEffect(() => {
    const currentUser = getUserInfo(); // Decode the JWT token to get user info.
    setUser(currentUser);
    fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/count/likes-for-post/${posts._id}`)
      .then((response) => response.json())
      .then((data) => {
        setLikeCount(data); // Contain the like count from the API response (Someone will do this)
      })
      .catch((error) => {
        console.error("Error fetching like count:", error);
      });
  }, [posts._id]);
  
  //function to handle the creation of and deletion of a like.
  const handleLikeClick = () => {
    const userId = user.id;
    handleIsLiked();
    if (!isLiked){
      try {
        axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/like`,  {postId, userId});
        handleIsLiked();
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          console.error("Error liking:", error.response.data.message);
        }
      }
    } else {
      try {
        axios.delete(`${process.env.REACT_APP_BACKEND_SERVER_URI}/likes/unLike`, {
          data: { postId, userId }, // Use 'data' field for DELETE requests to send the payload
        })
          .then((response) => {
            console.log("Unlike response:", response.data); // Log the response for debugging
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

  //handle isLiked variable for like button
  const handleIsLiked = async () => {
    const userId = user.id;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user-likes/${userId}`);
      const userLikes = response.data;
      const postLiked = userLikes.find((likes) => likes.postId === postId);
  
      if (postLiked) {
        setIsLiked(true); // User has liked the post
      } else {
        setIsLiked(false); // User has not liked the post
      }
    } catch (error) {
      console.error("Error checking user likes:", error);
    }
  };

  return (
    <div className="d-inline-flex p-2">
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Link to={`/publicprofilepage/${posts.username}`}>
            {posts.username}
          </Link>
          <Card.Text>{posts.content}</Card.Text>
          <div class="text-center">
            <Button
              variant={isLiked ? "danger" : "outline-danger"}
              onPrint={handleIsLiked}
              onMouseOver={handleIsLiked}
              onClick={handleLikeClick}
            >
              {isLiked ? 'Unlike' : 'Like'}
            </Button>
          </div>
          <p>{formattedDate}</p> {/* Display formattedDate */}
          {likeCount !== null && (
            <p>{`Likes: ${likeCount}`}</p> // Display likeCount if it's not null
          )}
          <Link
            style={{ marginRight: "1cm" }}
            to={`/updatePost/${posts._id}`}
            className="btn btn-warning"
          >
            Update
          </Link>
          <Link
          to=" /createComment.js"
          className="btn btn-waring"
          >
            Comment
            
          </Link>

        </Card.Body>
      </Card>
    </div>
  );
};

export default Post;
