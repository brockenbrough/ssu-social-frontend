import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import image1 from "../users/1.jpg";
import image2 from "../users/2.jpg";
import image3 from "../users/3.jpg";
import image4 from "../users/4.jpg";
import image5 from "../users/5.jpg";
import image6 from "../users/6.jpg";

const PRIMARY_COLOR = "#FFFFFF";
const SECONDARY_COLOR = "#0c0c1f";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/signup`;

const Register = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);

  // Slideshow related state and logic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [image1, image2, image3];
  const containerImages = [image4, image5, image6];
  const getNextImageIndex = () => (currentImageIndex + 1) % backgroundImages.length;

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
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
    try {
      setLoading(true);
      const { data: res } = await axios.post(url, data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        const responseError = error.response.data;
        setError(responseError.errorType === "InvalidUsername" ? "Invalid Username. The Username must be 6 characters or more." :
                responseError.errorType === "InvalidEmail" ? "Invalid Email. Please input a valid email." :
                responseError.errorType === "InvalidPassword" ? "Invalid Password. The password has to contain at least 8 characters, including one Uppercase, one Lowercase, and a Special character." :
                "The Username, Email or Password you've entered is invalid, Please try again");
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

  const formStyling = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
    margin: '1rem'
  };

  const buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: SECONDARY_COLOR
  };

  return (
    <div style={backgroundStyling}>
      <div style={formStyling}>
        <h2 className="text-center" style={{ color: PRIMARY_COLOR }}>Register</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label style={labelStyling}>Username</Form.Label>
            <Form.Control 
              type="text" 
              name="username" 
              onChange={handleChange} 
              placeholder="Enter username" 
            />
            <Form.Text className="text-muted" style={labelStyling}>
              The Username must be 6 characters or more
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label style={labelStyling}>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Enter email"
            />
            <Form.Text className="text-muted" style={labelStyling}>
              Please input a valid email
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label style={labelStyling}>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
            />
            <Form.Text className="text-muted" style={labelStyling}>
              The password has to contain at least 8 characters.
            </Form.Text>
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