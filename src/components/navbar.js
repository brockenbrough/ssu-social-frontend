import React, { useEffect, useState } from "react";
import getUserInfo from '../utilities/decodeJwt';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image'; 
import ReactNavbar from 'react-bootstrap/Navbar';

const stickyNavbarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 100,
};

export default function Navbar() {
  const [user, setUser] = useState(getUserInfo());

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
                <Nav.Link href="/feed-algorithm" className="navbar-brand">
                  <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s" rounded className="mr-2" style={{ width: '30px', height: '30px' }} />
                  SSU Social
                </Nav.Link>
              </div>
              <Container className="ml-auto">
                <Nav>
                  <Nav.Link href="/feed-algorithm">Feed</Nav.Link>
                  <Nav.Link href="/createpost">Create Post</Nav.Link>
                  <Nav.Link href="/getallpost">Explore</Nav.Link>
                  <Nav.Link href="/privateUserProfile">Profile</Nav.Link>
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
          <Nav.Link href="/" className="navbar-brand">SSU Social</Nav.Link>
          <Container className="ml-auto">
            <Nav>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Register</Nav.Link>
            </Nav>
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
    </ReactNavbar>
  );
}
