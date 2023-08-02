import React, { useState } from "react";
import { useNavigate } from "react-router";
import NavbarContributor from "./contributorNavbar";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

export default function CreateContributor() {
  // We define the state for the form.
  const [form, setForm] = useState({
    name: "",
    position: "",
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
    const newPerson = { ...form };

    await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/project_notes/contributor/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    setForm({ name: "", position: "" });
    navigate("/project-notes/contributors");
  }

  // This following section will display the form that takes the input from the user.
  // We refer to the functions we defined above for handling form changes.
  return (
    <div>
      <NavbarContributor/>
      <Card body outline color="success" className="mx-1 my-2" style={{ width: '30rem' }}>
        <Card.Title>Add Developer</Card.Title>
        <Card.Body> 
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" 
                        id="name"
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}
             />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPosition">
             <Form.Label>Position</Form.Label>
             <Form.Control type="text" placeholder="Enter position" 
                         id="position"
                         value={form.position}
                         onChange={(e) => updateForm({ position: e.target.value })}
             />
          </Form.Group>

          
          <Form.Group className="mb-3" controlId="formLevel">
             <Form.Label>Level</Form.Label>
             <Form.Control type="text" placeholder="Enter level" 
                         id="level"
                         value={form.level}
                         onChange={(e) => updateForm({ level: e.target.value })}
             />
          </Form.Group>
      
          <Button variant="primary" type="submit" onClick={onSubmit}>
            Submit
          </Button>
        </Form>
        </Card.Body>
      </Card>
      </div>
  );
}
