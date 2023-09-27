import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";

const Post = ({ posts, isLiked }) => {
  const [likeCount, setLikeCount] = useState(null);
  const formattedDate = moment(posts.date).format("MMMM Do YYYY, h:mm:ss a");
  const l = 0;
  useEffect(() => {
    //
    fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/count/likes-for-post/${posts._id}`)  //this 
      .then((response) => response.json())
      .then((data) => {
       // console.log("API Response:", data); // 
        setLikeCount(data);
        
      })
      .catch((error) => {
        console.error("Error fetching like count:", error);
      });
  }, [posts._id]);
  
  

  return (
    <div className="d-inline-flex p-2">
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Link to={`/publicprofilepage/${posts.username}`}>
            {posts.username}
          </Link>
          <Card.Text>{posts.content}</Card.Text>
          <div class="text-center">
            {isLiked ? (
              <Button variant="danger">Unlike</Button>
            ) : (
              <Button variant="outline-danger">Like</Button>
            )}
          </div>
          <p>{formattedDate}</p>
          
            <p>{likeCount} Likes</p>
          
          <Link
            style={{ marginRight: "1cm" }}
            to={`/updatePost/${posts._id}`}
            className="btn btn-warning"
          >
            Update
          </Link>
          <Link
          to=" /createComment.js"
          className="btn btn-warning"
          >
            Comment
            
          </Link>

        </Card.Body>
      </Card>
    </div>
  );
};

export default Post;
