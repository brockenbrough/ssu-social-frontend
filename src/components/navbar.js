import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image'; 
import ReactNavbar from 'react-bootstrap/Navbar';
import { useDarkMode } from '../components/DarkModeContext';
import DarkModeButton from "../components/DarkModeButton";
import Dropdown from 'react-bootstrap/Dropdown';
import { NavLink } from "react-bootstrap";

const stickyNavbarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 100,
};

export default function Navbar() {
  const [user, setUser] = useState(getUserInfo());
  const { darkMode } = useDarkMode();
  const location = useLocation(); // Get current path

  useEffect(() => {
    const userInfo = getUserInfo(); // Store user info in a variable
    setUser(userInfo); // Update state
  }, []); // Empty dependency array to make sure this only runs once when the component mounts and not loop infinitely

  const publicUser = () => {
    if (user) {
      return (
        <div style={stickyNavbarStyle}>
          <ReactNavbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"}>
            <Container>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Nav.Link href="/feed-algorithm" className={`navbar-brand ${darkMode ? 'text-light' : 'text-dark'}`}>
                  <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s" rounded className="mr-2" style={{ width: '30px', height: '30px' }} />
                  SSU Social
                </Nav.Link>
              </div>
              <Container className="ml-auto">
                <Dropdown>
                  <Dropdown.Toggle variant={darkMode ? "dark" : "light"} id="dropdown-basic">
                    Menu
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/feed-algorithm">For you</Dropdown.Item>
                    <Dropdown.Item href="/getallpost">Discover</Dropdown.Item>
                    <Dropdown.Item href="/privateUserProfile">Profile</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Nav className="ml-auto">
              <Nav.Link href="/createpost">
                Create Post
                <span style={{ fontSize: '1.2rem', marginLeft: '5px' }}>+</span>
              </Nav.Link>
            </Nav>
              </Container>
            </Container>
          </ReactNavbar>
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s" rounded className="mr-2" style={{ width: '30px', height: '30px' }} />
          <Nav.Link href="/" className={`navbar-brand ${darkMode ? 'text-light' : 'text-dark'}`}>SSU Social</Nav.Link>
          <Container className="ml-auto">
            <Dropdown>
              <Dropdown.Toggle variant={darkMode ? "dark" : "light"} id="dropdown-basic">
                Menu
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/">Login</Dropdown.Item>
                <Dropdown.Item href="/signup">Register</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </div>
      );
    }
  };

  return (
    <ReactNavbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <Container>
        <Nav>
          {publicUser()}
        </Nav>
      </Container>
      {/* Conditionally render the DarkModeButton based on the current pathname */}
      {location.pathname !== '/' && location.pathname !== '/signup' && <DarkModeButton />}
    </ReactNavbar>
  );
}
