import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    setUser(getUserInfo());
  }, [user]);

  const publicUser = () => {
    if (user) {
      return (
        <div style={stickyNavbarStyle}>
          <ReactNavbar bg="dark" variant="dark">
            <Container>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Nav.Link href="/feed-algorithm" className="navbar-brand text-light">
                  <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s" rounded className="mr-2" style={{ width: '30px', height: '30px' }} />
                  SSU Social
                </Nav.Link>
              </div>
              <Container className="ml-auto">
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    Menu
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/feed-algorithm">Feed</Dropdown.Item>
                    <Dropdown.Item href="/getallpost">Explore</Dropdown.Item>
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
          <Nav.Link href="/" className="navbar-brand text-light">SSU Social</Nav.Link>
          <Container className="ml-auto">
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
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
    <ReactNavbar bg="dark" variant="dark" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <Container>
        <Nav>
          {publicUser()}
        </Nav>
      </Container>
      <DarkModeButton/>
    </ReactNavbar>
  );
}

