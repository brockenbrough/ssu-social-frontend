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
  const navigate = useNavigate();
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");

  // Slideshow related state and logic
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [image1, image2, image3];
  const containerImages = [image4, image5, image6];
  const getNextImageIndex = () => (currentImageIndex + 1) % backgroundImages.length;

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  useEffect(() => {
    if (light) {
      setBgColor("white");
      setBgText("Dark mode");
    } else {
      setBgColor(SECONDARY_COLOR);
      setBgText("Light mode");
    }
  }, [light]);

  useEffect(() => {
    const slideshowInterval = setInterval(() => {
      setBgColor(SECONDARY_COLOR); // Reset background color
      setCurrentImageIndex(getNextImageIndex());
    }, 5000); // 30 seconds interval

    return () => {
      clearInterval(slideshowInterval);
    };
  }, [currentImageIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
  
      // const {accessToken} = res
      // store token in localStorage
      navigate("/");
    } catch (error) {
      if (error.response) {
        const responseError = error.response.data;
  
        // Clear previous error messages
        setError("");
  
        if (responseError.errorType === "InvalidUsername") {
          setError("Invalid Username. The Username must be 6 characters or more.");
        } else if (responseError.errorType === "InvalidEmail") {
          setError("Invalid Email. Please input a valid email.");
        } else if (responseError.errorType === "InvalidPassword") {
          setError("Invalid Password. The password has to contain at least 8 characters, including one Uppercase, one Lowercase, and a Special character.");
        } else {
          // For any other error types, set a generic error message
          setError("The Username, Email or Password you've entered is invalid, Please tey again");
        }
  
        console.log(responseError);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        setError("The Username, Email or Password you've entered is invalid, Please tey again");
      }
    }
  };
 

  let labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    textDecoration: "none",
    textShadow: `
      -1px -1px 0 #000,  
       1px -1px 0 #000,
       -1px 1px 0 #000,
        1px 1px 0 #000`
  };

  let backgroundStyling = {
    background: `url(${backgroundImages[currentImageIndex]}), url(${backgroundImages[getNextImageIndex()]}), url(${backgroundImages[getNextImageIndex()]})`,
    backgroundSize: 'cover',
    minHeight: '100vh',
    color: bgColor
  };

  let buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: bgColor,
  };

 
  return (
    <>
      <div style={backgroundStyling}>
        <section style={{ paddingTop: '200px' }}>
          <div className="container-fluid h-custom">
            <div className="row d-flex justify-content-center align-items-center h-100">

              <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label style={labelStyling}>Username</Form.Label>
                  <Form.Control 
                  type="username" 
                  name="username" 
                  onChange={handleChange} 
                  placeholder="Enter username" 
                  />
                  <Form.Text className="text-muted" style={labelStyling}>
                      The Username must be 6 characters or more
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail" style={labelStyling}>
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
                <Form.Group className="mb-3" controlId="formBasicPassword" style={labelStyling}>
                    <Form.Label style={labelStyling}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      onChange={handleChange}
                    />
                    <Form.Text className="text-muted" style={labelStyling}>
                      The password has to contain at least 8 characters, including one Uppercase, one Lowercase and a Special character
                    </Form.Text>
                    </Form.Group>
                <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      onChange={() => {
                        setLight(!light);
                      }}
                    />
                    <label
                      class="form-check-label"
                      for="flexSwitchCheckDefault"
                      className="text-muted"
                    >
                      {bgText}
                    </label>
                  </div>
                  {error && (
                    <div style={labelStyling} className="pt-3">
                      {error}
                    </div>
                  )}
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                    style={buttonStyling}
                    className="mt-2"
                  >
                    Submit
                  </Button>
                </Form>
              </div>

              {/* Slideshow Container on the Side */}
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
                      borderRadius: "8px"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};


export default Register;  

