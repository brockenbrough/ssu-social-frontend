//This is a comment about imports
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

import getUserInfo from "../../utilities/decodeJwt";
import socket from "../../utilities/socket";

// The ContributorList component.  This is the main component in this file.
export default function CommentList() {
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  let location = useLocation();
  // Hook useState - we are saying: call our state 'records' and use 'setRecords' to change it's value.

  // This method fetches the records from the database.
  // Hook useEffect - this hook is used to invoke something after rendering.
  useEffect(() => {
    // Define a function to get records. We are going to call it below.
    // We use async keyword so we can ．０later say "await" to block on finish.
     async function getRecords() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/getCommentById/${location.state}`, {
        method: "GET",
      })

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      if(response != null){
        const fetchedRecords = await response.json();
        setComments(fetchedRecords); // update state.  when state changes, we automatically re-render.
      }

 }

    getRecords(); // Now that we defined it, call the function.
    setUser(getUserInfo());

    socket.on("comment", (data) => {
      if (data.postId === location.state && data.type === "new") {
        setComments((prevComments) => [...prevComments, data.comment]);
      }
    });
  
    socket.on("deleteComment", (data) => {
      if (data.postId === location.state) {
        setComments((prevComments) => prevComments.filter((c) => c._id !== data.commentId));
      }
    });

    return () => {
      socket.off("comment");
      socket.off("deleteComment");
    };
  }, [location.state]);

  // A method to delete a contributor
  async function deleteComment(id) {
    await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/${id}`, {
      method: "DELETE",
    });

    // We're going to patch up our state by removing the records corresponding to id in our current state.
    const newRecords = comments.filter((el) => el._id !== id);
    setComments(newRecords); // This causes a re-render because we change state.

    socket.emit("deleteComment", { postId: location.state, commentId: id });
  }

  // This method will map out the records onthe table.
  // Records.map means for each item in 'records' do something.
  // In our case we're return a presentation tag that will invoke rendering on a record.
  // We are returning component tags for records. See use in rendering below.
  // Note that component <Record> below has 3 props being passed (record, deleteRecord(), key)
  function commentList() {
    if (comments ==null)
    {
      return(
        <div>
          <h3>
            No Comment Found
          </h3>
          </div>
      );
    }
    return comments.map((comment) => {
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
              <h4>{comment.commentContent}</h4>
            </div>
            <div>
            
              <Button
                variant="primary"
                className="mx-1 my-1"
                href={`/comments/editComment/${comment._id}`}
              >
                Edit
              </Button>
              
              <Button variant="primary" className="mx-1 my-1" onClick={() => deleteComment(comment._id)}>Delete</Button>
            </div>
          </Stack>
        </Card.Body>
      </Card>
      );
    });
  }
  if (!user)
    return (
      <div>
        <h3>
          You are not authorized to view this page, Please Login in{" "}
          <Link to={"/login"}>
            <a href="#">here</a>
          </Link>
        </h3>
      </div>
    );

  // This following section will display the table with the records of individuals.
  // This is what RecordList returns: a rendering.  Notice that recordList() is
  // doing a lot of work.
  return (
    <div>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <tbody>{commentList()}</tbody>
      </table>
    </div>
  );
}

//Evan bum Comment
//A comment made to test staging, committing, and pushing - Uk
