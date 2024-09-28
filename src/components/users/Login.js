import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";
const image1 = "/1.jpg"; // Path to images in the public folder
const image2 = "/2.jpg";
const image3 = "/3.jpg";
const image4 = "/4.jpg";
const image5 = "/5.jpg";
const image6 = "/6.jpg";

const PRIMARY_COLOR = "#622A0F";
const SECONDARY_COLOR = "#FFFFFF";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [image1, image2, image3];
  const containerImages = [image4,image5,image6];
  const getNextImageIndex = () => (currentImageIndex + 1) % backgroundImages.length;
  const navigate = useNavigate();

  let labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    textDecoration: "none",
  };

  let buttonStyling = {
    background: PRIMARY_COLOR,
    borderStyle: "none",
    color: bgColor,
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const obj = getUserInfo(user);
    setUser(obj);

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
      setLoading(true); // Set loading to true before making the request

      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      window.location.reload();

      setLoading(false); // Set loading to false after receiving the response
    } catch (error) {
      setLoading(false); // Set loading to false in case of an error

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

  if (user) {
    navigate("/feed-algorithm");
    return null; // Returning null if the user is already logged in
  }

  let backgroundStyling = {
    background: bgColor,
    backgroundImage: `url(${backgroundImages[currentImageIndex]}), url(${backgroundImages[getNextImageIndex()]}), url(${backgroundImages[getNextImageIndex()]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'left top, center top, right top', // Adjusted positions for side by side
    backgroundRepeat: 'no-repeat',
    cursor: loading ? 'wait' : 'auto' // Change cursor based on loading state
  };

  let containerStyle = {
    background: "white", // White background
    borderRadius: "10px", // Add border-radius for a rounded container
    padding: "20px", // Add padding to the container
  };

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom vh-100">
          <div className="row d-flex justify-content-center align-items-center h-100" style={backgroundStyling}>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <div style={containerStyle}>

                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label style={labelStyling}>User Name</Form.Label>
                  <Form.Control type="username" name="username" onChange={handleChange} placeholder="Enter username" />
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
                    <br></br>
                    This site is hosted on free services.  There may be a 2-3 minute delay
                    in the response if the site has not been used recently.
                  </Form.Text>
                </Form.Group>
                  
                  {error && <div style={labelStyling} className="pt-3">{error}</div>}
                  <Button variant="primary" type="submit" onClick={handleSubmit} style={buttonStyling} className="mt-2">
                    {loading ? "Logging in..." : "Log in"}
                  </Button>
                </Form>
              </div>
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
                    boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)", // Adjust the shadow properties as needed
                    border: "4px solid #ddd", // Adjust the border properties as needed
                    borderRadius: "8px" // Adjust the border radius as needed for rounded corners
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
