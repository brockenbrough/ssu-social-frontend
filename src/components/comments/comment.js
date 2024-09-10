import React from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const Comment = (props) => {
  const comment = props.record;
  const deleteComment = async (comment) => {
    axios.delete(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/${comment._id}`)
        .then(response => {
            alert('Comment deleted.')
        })
        .catch(error => alert('Error deleting comment'))
  }

  return (
    <Card
      body
      outline
      color="success"
      className="mx-1 my-2"
      style={{ width: "30rem" }}
    >
      <Card.Body>
        <Stack>
          <div>
            <textarea
                className="form-control"
                rows="4"
                value={comment.commentContent}
                readOnly
                style={{
                  resize: "none",
                  whiteSpace: "pre-line",
                  overflowWrap: "break-word", // Add this line
                }}
              />
          </div>
          <div>
            <Button
              variant="primary"
              className="mx-1 my-1"
              href={`/comments/editComment/${comment._id}`}>
              Edit
            </Button>
            
            <Button variant="primary" className="mx-1 my-1" onClick={() => deleteComment(comment)}>Delete</Button>
          </div>
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default Comment;
