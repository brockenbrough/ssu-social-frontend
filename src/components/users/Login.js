import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import getUserInfo from "../../utilities/decodeJwt";

const PRIMARY_COLOR = "#FFFFFF";
const SECONDARY_COLOR = "#000000";
const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/login`;

const Login = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [light, setLight] = useState(false);
  const [bgColor, setBgColor] = useState(SECONDARY_COLOR);
  const [bgText, setBgText] = useState("Light Mode");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  let labelStyling = {
    color: PRIMARY_COLOR,
    fontWeight: "bold",
    textDecoration: "none",
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
    background: `url(${'https://ik.imagekit.io/upgrad1/abroad-images//university/234/image/campus_view_4IK5K1C.jpg'}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    color: bgColor 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await axios.post(url, data);
      const { accessToken } = res;
      localStorage.setItem("accessToken", accessToken);
      window.location.reload();
    } catch (error) {
      setError("The Password or Username you've entered is incorrect. Please try again.");
    }
  };

  if (user) {
    navigate("/feed-algorithm");
    return;
  }

  return (
    <>
      <section className="vh-100">
        <div className="container-fluid h-custom vh-100">
          <div className="row d-flex justify-content-center align-items-center h-100" style={backgroundStyling}>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label style={labelStyling}>Username</Form.Label>
                  <Form.Control type="username" name="username" onChange={handleChange} placeholder="Enter username" />
                  <Form.Text className="text-muted" style={labelStyling}>We just might sell your data</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label style={labelStyling}>Password</Form.Label>
                  <Form.Control type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} />
                  <Button variant="secondary" onClick={togglePasswordVisibility} className="mt-2">
                    {passwordVisible ? "Hide Password" : "Show Password"}
                  </Button>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Text className="text-muted pt-1" style={labelStyling}>
                    Need an account?
                    <span>
                      <Link to="/signup" style={labelStyling}> Sign up</Link>
                    </span>
                  </Form.Text>
                </Form.Group>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={() => { setLight(!light); }} />
                  <label class="form-check-label" for="flexSwitchCheckDefault" className="text-muted">
                    {bgText}
                  </label>
                </div>
                {error && <div style={labelStyling} className="pt-3">{error}</div>}
                <Button variant="primary" type="submit" onClick={handleSubmit} style={buttonStyling} className="mt-2">
                  Submit
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
