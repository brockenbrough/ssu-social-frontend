import Card from 'react-bootstrap/Card';
import React from 'react';

const Landingpage = () => {    
    return (
        <Card style={{ width: '30rem' }} className="mx-2 my-2">
        <Card.Body>
          <Card.Title>Welcome to the really amazing CSC 351 Social Media App</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Social media as you've never seen it before.</Card.Subtitle>
          <Card.Text>
          </Card.Text>
          <Card.Link href="/signup">Sign Up</Card.Link>
          <Card.Link href="/login">Login</Card.Link>
        </Card.Body>
      </Card>
    )
}
export default Landingpage