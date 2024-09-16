import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";
import image1 from "../users/1.jpg";
import image2 from "../users/2.jpg";
import image3 from "../users/3.jpg";
import image4 from "../users/4.jpg";
import image5 from "../users/5.jpg";
import image6 from "../users/6.jpg";

const PRIMARY_COLOR = "#622A0F";
const SECONDARY_COLOR = "#FFFFFF";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading indicator state
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [image1, image2, image3];
  const containerImages = [image4, image5, image6];
  const getNextImageIndex = () => (currentImageIndex + 1) % backgroundImages.length;
  const navigate = useNavigate();

  // Styles for labels and buttons
  const labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  };

  const buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: bgColor,
  };

  // Handle form input changes
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Set background color and text based on light mode
  useEffect(() => {
    if (light) {
      setBgColor("white");
      setBgText("Dark mode");
    } else {
      setBgColor(SECONDARY_COLOR);
      setBgText("Light mode");
    }
  }, [light]);

  // Slideshow effect for background images
  useEffect(() => {
    const slideshowInterval = setInterval(() => {
      setBgColor(SECONDARY_COLOR); // Reset background color
      setCurrentImageIndex(getNextImageIndex());
    }, 5000); // 5 seconds interval

    return () => {
      clearInterval(slideshowInterval);
    };
  }, [currentImageIndex]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Start loading indicator

      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      window.location.reload();

      setLoading(false); // Stop loading indicator
    } catch (error) {
      setLoading(false); // Stop loading indicator on error

      if (error.response) {
        alert(`Error: ${error.response.data} ${error.response.status} ${url}`);
        console.log(error.response.data);
      } else {
        alert(`${error.message}. An error occurred contacting ${url}`);
        console.log("Error", error.message);
      }
      setError("Something went wrong. Please try again.");
    }
  };

  // Redirect if user is already logged in
  if (user) {
    navigate("/feed-algorithm");
    return null; // Return null if already logged in
  }

  // Styles for background and container
  const backgroundStyling = {
    background: bgColor,
    backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    cursor: loading ? 'wait' : 'auto', // Change cursor based on loading state
    minHeight: '100vh' // Ensure the background covers the full viewport height
  };

  const containerStyle = {
    background: "white", // White background for container
    borderRadius: "10px", // Rounded corners for container
    padding: "20px", // Padding inside container
    position: 'relative', // To ensure proper overlay of the form
    zIndex: 2 // Make sure the form is above the background
  };

  const imageContainerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 1
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom vh-100" style={backgroundStyling}>
          <div className="row d-flex justify-content-center align-items-center h-100" style={{ position: 'relative' }}>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <div style={containerStyle}>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={labelStyling}>User Name</Form.Label>
                    <Form.Control type="text" name="username" onChange={handleChange} placeholder="Enter username" />
                    <Form.Text className="text-muted">We just might sell your data</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={labelStyling}>Password</Form.Label>
                    <Form.Control type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} />
                    <Button variant="secondary" onClick={togglePasswordVisibility} className="mt-2">
                      {passwordVisible ? "Hide Password" : "Show Password"}
                    </Button>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Text className="text-muted pt-1">
                      Need an account?
                      <span>
                        <Link to="/signup" style={labelStyling}> Sign up</Link>
                      </span>
                      <br />
                      This site is hosted on free services. There may be a 2-3 minute delay
                      in the response if the site has not been used recently.
                    </Form.Text>
                  </Form.Group>
                  
                  {error && <div style={labelStyling} className="pt-3">{error}</div>}
                  <Button variant="primary" type="submit" style={buttonStyling} className="mt-2">
                    {loading ? "Logging in..." : "Log in"}
                  </Button>
                </Form>
              </div>
            </div>
            {/* Slideshow Container */}
            <div className="col-md-4 d-none d-md-block" style={imageContainerStyle}>
              <img
                src={containerImages[currentImageIndex]}
                alt="Slideshow"
                style={imageStyle}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
