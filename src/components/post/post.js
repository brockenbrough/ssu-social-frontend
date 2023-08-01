import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import moment from "moment";

const Post = ({ posts, isLiked }) => {
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
          <p>{moment(posts.createdAt).format("MMM DD yyyy")}</p>
          <Link
            style={{ marginRight: "1cm" }}
            to={`/updatePost/${posts._id}`}
            className="btn btn-warning "
          >
            Update
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Post;
