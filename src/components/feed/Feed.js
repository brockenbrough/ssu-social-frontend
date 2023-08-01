import React, { useState, useEffect, useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useNavigate, Link } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';
import './feed.css';
const Feed = () => {
    const [user, setUser] = useState({})
    

    useEffect(() => {
      setUser(getUserInfo())
    }, [])

    if (!user) return (
        <div>
            <h3>
                You are not authorized to view this page, Please Login in <Link to={'/login'}> <a href='#'> here </a> </Link>
            </h3>
        </div>
    )

    return (
        <>
            <div>
                <Card>
                    <Card.Header>CheeseB0y</Card.Header>
                    <Card.Body>I love this cool new social media web application!</Card.Body>
                    <div>
                        <ToggleButton href='#'>235 ❤︎</ToggleButton>
                        <Button>Comments</Button>
                    </div>
                    <Card.Footer>11/10/2022</Card.Footer>
                </Card>
                <Card>
                    <Card.Header>NewUser23</Card.Header>
                    <Card.Body>Hello, I am new here :)</Card.Body>
                    <div>
                        <ToggleButton href='#'>3 ❤︎</ToggleButton>
                        <Button>Comments</Button>
                    </div>
                    <Card.Footer>11/14/2022</Card.Footer>
                </Card>
                <Card>
                    <Card.Header>JWood</Card.Header>
                    <Card.Body>This is a test UI and does not actually work yet</Card.Body>
                    <div>
                        <ToggleButton href='#'>2.3M ❤︎</ToggleButton>
                        <Button>Comments</Button>
                    </div>
                    <Card.Footer>12/31/2999</Card.Footer>
                </Card>
            </div>
        </>
    )
}

export default Feed