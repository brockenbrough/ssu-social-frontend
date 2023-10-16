import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import ReactNavbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router-dom";

// Define sticky navbar
const stickyNavbarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 100,
};

//display Navbar
export default function Navbar() {
  const [user, setUser] = useState({})

  useEffect(() => {
    setUser(getUserInfo())
  }, [])

  return (
    <div style={stickyNavbarStyle}>
      <ReactNavbar bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/feed-algorithm">Feed</Nav.Link>
            <Nav.Link href="/createpost">Create Post</Nav.Link>
            <Nav.Link href="/getallpost">Explore</Nav.Link>
            <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
          </Nav>
        </Container>
      </ReactNavbar>
    </div>
  );
}
