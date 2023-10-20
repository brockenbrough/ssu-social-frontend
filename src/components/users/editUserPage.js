import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import getUserInfo from '../../utilities/decodeJwt';
import {useDarkMode } from '../DarkModeContext';

const EditUserPage = () =>{
  const { darkMode } = useDarkMode();
  const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/editUser`;
  const navigate = useNavigate();

  // form validation checks
  const [ errors, setErrors ] = useState({})
  const findFormErrors = () => {
    const {username, email, password} = form
    const newErrors = {}
    // username validation checks
    if (!username || username === '') newErrors.name = 'Input a valid username'
    else if (username.length < 6) newErrors.name = 'Username must be at least 6 characters'
    // email validation checks
    if (!email || email === '') newErrors.email = 'Input a valid email address'
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Input a valid email address'
    // password validation checks
    if (!password || password === '') newErrors.password = 'Input a valid password'
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    return newErrors
  }

  // initialize form values and get userId on render
  const [form, setValues] = useState({userId : "", username: "", email: "", password: "", biography: "" })
  useEffect(() => {
    setValues({userId : getUserInfo().id})
  }, [])

  // handle form field changes
  const handleChange = ({ currentTarget: input }) => {
    setValues({ ...form, [input.id]: input.value });
    if ( !!errors[input] ) setErrors({
      ...errors,
      [input]: null
    })
  };

  // handle form submission with submit button
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors()
    if(Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    }
    else {
      try {
        const { data: res } = await axios.post(url, form);
        const { accessToken } = res;
        //store token in localStorage
        localStorage.setItem("accessToken", accessToken);
        navigate("/privateuserprofile");
      } catch (error) {
      if (
        error.response &&
        error.response.status != 409 &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        window.alert(error.response.data.message);
      }
      if (error.response &&
        error.response.status === 409
      ) {
        setErrors({name : "Username is taken, pick another"})
      }
    }
    }
  }

    // initialize checkbox state
  const [keepUsername, setKeepUsername] = useState(false);
  const [keepEmail, setKeepEmail] = useState(false);

  // handle cancel button
  const handleCancel = async => {
    navigate("/privateuserprofile");
  }

  // handle keep username checkbox change
  const handleKeepUsernameChange = () => {
    setKeepUsername(!keepUsername);
    if (!keepUsername) {
      setValues({ ...form, username: getUserInfo().username });
    } else {
      setValues({ ...form, username: "" });
    }
    if (form.username && !keepUsername) {
      setValues({ ...form, username: "" });
    }
  };

  // handle keep email checkbox change
  const handleKeepEmailChange = () => {
    setKeepEmail(!keepEmail);
    if (!keepEmail) {
      setValues({ ...form, email: getUserInfo().email });
    } else {
      setValues({ ...form, email: "" });
    }
    if (form.email && !keepEmail) {
      setValues({ ...form, email: "" });
    }
  };

  return(
    <div style={{backgroundColor: darkMode ? "#000" : "#f6f8fa", color: darkMode ? "#fff" : "#000", minHeight: '100vh', paddingTop: '15px',}}>
      <Card body outline color="success" className="mx-1 my-2" style={{ width: '30rem', backgroundColor: darkMode ? "#181818" : "#f6f8fa", color: darkMode ? "#fff" : "#000",}}>
        <Card.Title>Edit User Information</Card.Title>
        <Card.Body> 
        <Form>

          <Form.Group className="mb-3" controlId="formName" >
            <Form.Label >Username</Form.Label>
            <Form.Control type="text" placeholder="Enter new username" 
              id="username"
              value={form.username}
              onChange={handleChange}
              isInvalid={ !!errors.name }
              disabled={keepUsername}
              style={{background: darkMode ? '#181818' : 'white',
                    color: darkMode ? 'white' : 'black', }}
            />
            <Form.Control.Feedback type='invalid'>
              { errors.name }
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formKeepUsername">
            <Form.Check
              type="checkbox"
              label="Keep username"
              checked={keepUsername}
              onChange={handleKeepUsernameChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
             <Form.Label>Email address</Form.Label>
             <Form.Control type="text" placeholder="Enter new email address" 
                id="email"
                value={form.email}
                onChange={handleChange}
                isInvalid = { !!errors.email }
                disabled = {keepEmail}
                style={{background: darkMode ? '#181818' : 'white',
                    color: darkMode ? 'white' : 'black', }}
             />
             <Form.Control.Feedback type='invalid'>
              { errors.email }
             </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formKeepEmail">
            <Form.Check
              type="checkbox"
              label="Keep email"
              checked={keepEmail}
              onChange={handleKeepEmailChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              id="password"
              value={form.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              style={{background: darkMode ? '#181818' : 'white',
                    color: darkMode ? 'white' : 'black', }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBiography">
            <Form.Label>Biography</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your bio"
              id="biography"
              value={form.biography}
              onChange={handleChange}
              style={{background: darkMode ? '#181818' : 'white',
                    color: darkMode ? 'white' : 'black', }}
            />
          </Form.Group>

        <Row>
          <Col>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
          </Col>

          <Col>
          <Button variant="primary" type="cancel" onClick={handleCancel}>
            Cancel
          </Button>
          </Col>
        </Row>

        </Form>
        </Card.Body>
      </Card>
      </div>
  )
}

export default EditUserPage;