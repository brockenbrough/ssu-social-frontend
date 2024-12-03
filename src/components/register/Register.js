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

const PRIMARY_COLOR = "#622A0F";
const SECONDARY_COLOR = "#FFFFFF";
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
      setBgColor(SECONDARY_COLOR); // Reset background color
      setCurrentImageIndex(getNextImageIndex());
    }, 5000); // 5 seconds interval

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
    } else if (data.username.length > 28) {
      errors.username = "Username must be less than 28 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Email address is invalid.";
    }
    if (!data.password) {
      errors.password = "Password is required.";
    } else if (data.password.length < 8) {
      errors.password = "Password must be 8 characters or more.";
    }

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
        setError("The Username, Email, or Password you've entered is invalid. Please try again");
      }
    }
  };

  const labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    textDecoration: "none",
  };

  const backgroundStyling = {
    background: `url(${backgroundImages[currentImageIndex]})`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    color: PRIMARY_COLOR,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const containerStyle = {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
  };

  const buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: SECONDARY_COLOR,
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom vh-100">
        <div className="row d-flex justify-content-center align-items-center h-100" style={backgroundStyling}>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <div style={containerStyle}>
              <h2 className="text-center" style={{ color: PRIMARY_COLOR }}>Create an Account</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label style={labelStyling}>Username</Form.Label>
                  <Form.Control
                    type="username"
                    name="username"
                    onChange={handleChange}
                    placeholder="6-28 characters"
                    isInvalid={!!fieldErrors.username}
                  />
                  {fieldErrors.username && (
                    <Form.Text style={{ color: '#ff9999' }}>{fieldErrors.username}</Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label style={labelStyling}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter email"
                    isInvalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email && (
                    <Form.Text style={{ color: '#ff9999' }}>{fieldErrors.email}</Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label style={labelStyling}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="8 characters or more"
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.password}
                  />
                  {fieldErrors.password && (
                    <Form.Text style={{ color: '#ff9999' }}>{fieldErrors.password}</Form.Text>
                  )}
                </Form.Group>
                {error && <div style={{ color: 'red' }} className="mb-3">{error}</div>}
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
          </div>
          <div className="col-md-4 d-none d-md-block">
            <div style={{ height: "100%", overflow: "hidden" }}>
              <img
                src={containerImages[currentImageIndex]}
                alt="Slideshow"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
                  border: "4px solid #ddd",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
