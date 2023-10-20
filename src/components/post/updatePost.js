import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {useParams, useNavigate } from "react-router";
import Navbar from '../navbar';
import getUserInfo from "../../utilities/decodeJwt";
import { Link } from "react-router-dom";
import {useDarkMode } from '../DarkModeContext';
import { Form, Button } from 'react-bootstrap'

    const UpdatePost = (props) => {
        const { darkMode } = useDarkMode();
        const [user, setUser] = useState(null);
        const [state, setState] = useState({
            username: '',
            content: '',
        })
        const params = useParams()

       const navigate = useNavigate();

       useEffect(() => {
        setUser(getUserInfo());
      }, []);

        useEffect(() => {
            axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getPostById/${params.postId}`)
                .then(res => {
                    setState(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }, [])

        const handleChange = (e) => {
            setState({
                ...state,
                [e.target.name]: e.target.value
            })
        }

        const handleSubmit = (e) => {
            e.preventDefault()
            axios.put(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/updatePost/${params.postId}`, state)
                .then(res => {
                    console.log(res)
                    navigate(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllPosts/${params.postId}`)
                })
                .catch(err => {
                    console.log(err)
                })
        }



        const showUpdateForm =()=>{

            if (!user) {
                return (
                  <div>
                    <h3>
                      You are not authorized to view this page, Please Login in{" "}
                      <Link to={"/login"}>
                        <a href="#">here</a>
                      </Link>
                    </h3>
                  </div>
                );
              }

            return(

             
                <div className="container" style={{backgroundColor: darkMode ? "#000" : "#f6f8fa", color: darkMode ? "#fff" : "#000",}}>
                   
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                           
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
    
                                    <Form.Control type="text" placeholder="Enter username" value={state.username} onChange={handleChange} name="username" style={{ height: '2cm', width: '12cm', marginLeft: '10cm', marginTop: '2cm', background: darkMode ? '#181818' : 'white',
                    color: darkMode ? 'white' : 'black', }} />
                                </Form.Group>
    
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control type="text" placeholder="Content" name="content" value={state.content} onChange={handleChange}  style={{ height: '3cm', width: '12cm', marginLeft: '10cm', marginTop: '2cm', background: darkMode ? '#181818' : 'white',
                    color: darkMode ? 'white' : 'black', }} />
                                </Form.Group>
                            
                                <Button style={{ width: '4cm', marginLeft: '10cm', marginTop: '2cm' }} variant="primary" type="submit">
                                    Update
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>

            )

        }
    
    
      return (
         
        <div  style={{backgroundColor: darkMode ? "#000" : "#f6f8fa", color: darkMode ? "#fff" : "#000", textAlign: 'center', minHeight: '100vh',}}>
        <h1>UPDATE POST</h1>
        {showUpdateForm()}
    </div>
      )
    }


export default UpdatePost