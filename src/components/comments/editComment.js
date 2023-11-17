import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

// Edit Component
export default function EditComment() {
  const currentDate = new Date();
  const [form, setForm] = useState({
    commentContent: "",
    date: currentDate,
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/${params.id.toString()}`
      );

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);
  // methodss
  // These methods will update the state properties.
  // The value is an object like {name: "Jose"} identifying field and new value.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // Function that sends the request to the server to update the record.
  async function onSubmit(e) {
    e.preventDefault();
    const currentDate = new Date();

    const editedComment = {
      commentContent: form.commentContent,
      date: currentDate,
    };

    // This will send a post request to update the data in the database.
    await fetch(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/update/${params.id.toString()}`,
      {
        method: "PUT",
        body: JSON.stringify(editedComment),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    navigate("/comments/comment");
  }

  // This following section will display the form that takes input from the user to update the data.
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
        <Card.Body>
          <Form>
          <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                  style={{
                  wordWrap: 'break-word',
                  minHeight: '100px',
                  resize: 'vertical',
                  }}
                  as="textarea"
                  placeholder="Enter comment"
                  id="comment"
                  value={form.comment}
                  onChange={(e) => updateForm({ commentContent: e.target.value })}
                  />
            </Form.Group>


            <Button variant="primary" type="submit" onClick={onSubmit}>
              Submit comment
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
