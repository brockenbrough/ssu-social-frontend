import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


import { Link } from 'react-router-dom';

const defaultLayout = () => {

    return (
        <Navbar bg="orange" expand="lg" style={{ background: 'lightpink' }}>
            <Container>
                <Navbar.Brand>Social</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/" className="nav-link"><h3>Home</h3></Link>
                        <Link to="/allpost" className="nav-link"><h3>Allpost</h3></Link>
                        <Link to="/createpost" className="nav-link"><h3>Create-Post</h3></Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );



}

export default defaultLayout