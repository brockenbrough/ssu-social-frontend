import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios'
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";

const EditUser = () => {
  const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/editUser`;

  // form validation checks
  const [ errors, setErrors ] = useState({});

  const findFormErrors = () => {
    const {username, email, password, biography} = form;
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
    // biography character limit check
    if (biography.length > 200) newErrors.biography = 'Your bio is too long!'
    return newErrors
  }

  // initialize form values and get userId on render
  const[form, setValues] = useState({userId: "", username: "", email: "", password: "", biography: ""});
  useEffect(() => {
    getUserInfoAsync()
      .then(userInfo => {
        setValues({
          userId: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
          password: userInfo.password,
          biography: userInfo.biography
        })
      })
      .catch(error => {
        console.error('Error getting user info:', error);
      });
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
        window.location.reload(true);
      } catch (error) {
      if (
        error.response &&
        error.response.status !== 409 &&
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

  return(
    <Form>
          <Form.Group className="mb-3" controlId="formName" >
            <Form.Label >Username</Form.Label>
            <Form.Control type="text" placeholder="Enter new username" 
              id="username"
              value={form.username}
              disabled={true}
              onChange={handleChange}
              isInvalid={ !!errors.name }
            />
            <Form.Control.Feedback type='invalid'>
              { errors.name }
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
             <Form.Label>Email address</Form.Label>
             <Form.Control type="email" placeholder="Enter new email address" 
                id="email"
                value={form.email}
                onChange={handleChange}
                isInvalid = { !!errors.email }
             />
             <Form.Control.Feedback type='invalid'>
              { errors.email }
             </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword" >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              id="password"
              value={form.password}
              onChange={handleChange}
              isInvalid={ !!errors.password }
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBio" >
            <Form.Label>Biography</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter your bio"
              id="biography"
              value={form.biography}
              onChange={handleChange}
              isInvalid={ !!errors.biography }
            />
            <Form.Control.Feedback type="invalid">
              {errors.biography}
            </Form.Control.Feedback>
          </Form.Group>

        <Row>
          <Col>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
          </Col>
        </Row>

        </Form>
  )
}

export default EditUser;