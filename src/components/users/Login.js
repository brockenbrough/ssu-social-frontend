import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";

const image1 = "/1.jpg";
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
  const [loading, setLoading] = useState(false);
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [image1, image2, image3];
  const containerImages = [image4, image5, image6];
  const getNextImageIndex = () => (currentImageIndex + 1) % backgroundImages.length;
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({ username: "", password: "" });

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
    setFieldErrors({ ...fieldErrors, [input.name]: "" });
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

    setFieldErrors({ username: "", password: "" });

    let errors = {};

    if (!data.username) errors.username = "Username is required.";
    if (!data.password) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    try {
      setLoading(true);

      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      window.location.reload();

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.response) {
        setFieldErrors({ ...fieldErrors, password: "Invalid username or password." });
        console.log(error.response.data);
      } else {
        setFieldErrors({ ...fieldErrors, password: `${error.message}. Unable to reach the server.` });
        console.log("Error", error.message);
      }
      setError("Something went wrong. Please try again.");
    }
  };

  if (user) {
    navigate("/feed-algorithm");
    return null;
  }

  let backgroundStyling = {
    background: bgColor,
    backgroundImage: `url(${backgroundImages[currentImageIndex]}), url(${backgroundImages[getNextImageIndex()]}), url(${backgroundImages[getNextImageIndex()]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'left top, center top, right top',
    backgroundRepeat: 'no-repeat',
    cursor: loading ? 'wait' : 'auto',
  };

  let containerStyle = {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
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
                    <Form.Control type="username" name="username" onChange={handleChange} placeholder="Enter username" isInvalid={!!fieldErrors.username} />
                    {fieldErrors.username && (
                      <Form.Text className="text-danger">{fieldErrors.username}</Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={labelStyling}>Password</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        isInvalid={!!fieldErrors.password}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{
                          background: "transparent",
                          border: "none",
                          padding: "0 10px",
                          cursor: "pointer",
                          color: PRIMARY_COLOR,
                        }}
                      >
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <Form.Text className="text-danger">{fieldErrors.password}</Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Text className="text-muted pt-1">
                      Need an account?
                      <span>
                        <Link to="/signup" style={labelStyling}> Sign up</Link>
                      </span>
                    </Form.Text>
                  </Form.Group>

                  {error && <div style={labelStyling} className="pt-3">{error}</div>}
                  <Button variant="primary" type="submit" onClick={handleSubmit} style={buttonStyling} className="mt-2">
                    {loading ? "Logging in..." : "Log in"}
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
    </>
  );
};

export default Login;
