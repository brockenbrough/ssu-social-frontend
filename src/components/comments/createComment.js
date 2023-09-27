import React, { useState } from "react";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

export default function CreateComments() {
  const currentDate = new Date();
  // We define the state for the form.
  const [form, setForm] = useState({
    commentContent: "",
    date: currentDate,
  });
  const navigate = useNavigate();

  // These methods will update the state properties.
  // It is called with a specific value (name, position or level) that changed.
  // We update the state of the form.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newComment = { ...form };

    await fetch(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComment),
      }
    ).catch((error) => {
      window.alert(error);
      return;
    });

    setForm({ commentContent: "" });
    navigate("/comments/comment");
  }

  // This following section will display the form that takes the input from the user.
  // We refer to the functions we defined above for handling form changes.
  return (
    <div>
      <navbarComment />
      <Card
        body
        outline
        color="success"
        className="mx-1 my-2"
        style={{ width: "30rem" }}
      >
        <Card.Title>Add Comment</Card.Title>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter comment"
                id="comment"
                value={form.commentContent}
                onChange={(e) => updateForm({ commentContent: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={onSubmit}>
              submit comment
            </Button>
       
            <Button variant="primary" onClick={() => navigate("/getallpost")}  style={{ marginLeft: "10px" }}>
             cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
