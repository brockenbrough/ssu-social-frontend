import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
const image1 = "/1.jpg"; // Path to images in the public folder
const image2 = "/2.jpg";
const image3 = "/3.jpg";
const image4 = "/4.jpg";
const image5 = "/5.jpg";
const image6 = "/6.jpg";

const PRIMARY_COLOR = "#FFFFFF";
const SECONDARY_COLOR = "#0c0c1f";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const Register = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [fieldErrors, setFieldErrors] = useState({ username: "", email: "", password: "" });

  // Slideshow related state and logic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [image1, image2, image3];
  const containerImages = [image4, image5, image6];
  const getNextImageIndex = () => (currentImageIndex + 1) % backgroundImages.length;

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    setFieldErrors({ ...fieldErrors, [input.name]: "" });
  };

  useEffect(() => {
    setBgColor(SECONDARY_COLOR);
  }, []);

  useEffect(() => {
    const slideshowInterval = setInterval(() => {
      setCurrentImageIndex(getNextImageIndex());
    }, 5000);// 5000 milliseconds = 5 second interval

    return () => {
      clearInterval(slideshowInterval);
    };
  }, [currentImageIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFieldErrors({ username: "", email: "", password: "" });
    let errors = {};
    
    
    if (!data.username) {
      errors.username = "Username is required.";
      } else if (data.username.length < 6) {
        errors.username = "Username must be 6 characters or longer.";
      } else if (data.username.length > 28){
        errors.username = "Username must be less than 28 characters."
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!data.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Email address is invalid";
    }
    if (!data.password) {
      errors.password = "Password is required.";
    } else if (data.password.length < 8) {
      errors.password = "Password must be 8 characters or more.";
    }
    // If there are validation errors, set them and stop submission
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const { data: res } = await axios.post(url, data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setFieldErrors({ ...fieldErrors, username: "Username must contain 6 characters or more" });
        console.log(error.response.data);
        setFieldErrors({ ...fieldErrors, email: "Enter a valid email address" });
        console.log(error.response.data);
        setFieldErrors({ ...fieldErrors, password: "Password must be 8 characters or more" });
        console.log(error.response.data);
      } else {
        setError("The Username, Email, or Password you've entered is invalid. Please try again");
      }
    }
  };

  const labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
  };

  const backgroundStyling = {
    background: `url(${backgroundImages[currentImageIndex]})`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    color: PRIMARY_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  };

  const buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: SECONDARY_COLOR
  };

  return (
    <div style={backgroundStyling}>
      <div>
        <h2 className="text-center" style={{ color: PRIMARY_COLOR }}>Create an Account</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label style={labelStyling}>Username</Form.Label>
            <Form.Control 
            type="username" 
            name="username" 
            onChange={handleChange} 
            placeholder="6-28 characters" 
            isInvalid={!!fieldErrors.username}/>
                  {fieldErrors.username && (
                    <Form.Text style={{ color: '#ff9999'}}>{fieldErrors.username}</Form.Text>
                  )}
            {error.username && (
              <Form.Control.Feedback type="invalid">
                {error.username}
              </Form.Control.Feedback>
            )}
           
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label style={labelStyling}>Email</Form.Label>
            <Form.Control 
            type="email" 
            name="email" 
            onChange={handleChange} 
            placeholder="Enter email" 
            isInvalid={!!fieldErrors.email}/>
                  {fieldErrors.email && (
                    <Form.Text style={{ color: '#ff9999'}}>{fieldErrors.email}</Form.Text>
                  )}
            {error.email && (
              <Form.Control.Feedback type="invalid">
                {error.email}
              </Form.Control.Feedback>
            )}
           
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label style={labelStyling}>Password</Form.Label>
            <Form.Control 
            type="password" 
            name="password" 
            placeholder="8 characters or more" 
            onChange={handleChange} 
            isInvalid={!!fieldErrors.password}/>
                  {fieldErrors.password && (
                    <Form.Text style={{ color: '#ff9999'}}>{fieldErrors.password}</Form.Text>
                  )
                  }
            {error.password && (
              <Form.Control.Feedback type="invalid">
                {error.password}
              </Form.Control.Feedback>
            )}
            
          </Form.Group>
          {error && (
            <div className="text-danger mb-3">
              {error}
            </div>
          )}
          <Button
            variant="primary"
            type="submit"
            style={buttonStyling}
            className="w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Form>
      </div>
      {/* Slideshow Container on the Side */}
      <div className="position-absolute" style={{ top: 0, right: 0, width: '30%', height: '100%' }}>
        <img
          src={containerImages[currentImageIndex]}
          alt="Slideshow"
          style={{
            width: '100%',
            height: '100%',
            objectFit: "cover",
            boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px"
          }}
        />
      </div>
    </div>
  );
};

export default Register;