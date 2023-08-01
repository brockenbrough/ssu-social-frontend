import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import NavbarContributor from "./contributorNavbar";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';


// Edit Component
export default function EditContributor() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:8095/project_notes/contributor/${params.id.toString()}`);

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
    const editedPerson = {
      name: form.name,
      position: form.position,
      level: form.level,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:8095/project_notes/contributor/update/${params.id.toString()}`, {
      method: "PUT",
      body: JSON.stringify(editedPerson),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/project-notes/contributors");
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <NavbarContributor/>

      <Card body outline color="success" className="mx-1 my-2" style={{ width: '30rem' }}>
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
