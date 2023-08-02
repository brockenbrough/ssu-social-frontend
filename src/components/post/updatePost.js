import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {useParams, useNavigate } from "react-router";
import Navbar from '../navbar';

import { Form, Button } from 'react-bootstrap'



    const UpdatePost = (props) => {
        const [state, setState] = useState({
            username: '',
            content: '',
        })
        const params = useParams()

       const navigate = useNavigate();

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

            

            return(

             
                <div className="container">
                   
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                           
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
    
                                    <Form.Control type="text" placeholder="Enter username" value={state.username} onChange={handleChange} name="username" style={{ height: '2cm', width: '12cm', marginLeft: '10cm', marginTop: '2cm' }} />
                                </Form.Group>
    
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Control type="text" placeholder="Content" name="content" value={state.content} onChange={handleChange}  style={{ height: '3cm', width: '12cm', marginLeft: '10cm', marginTop: '2cm' }} />
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
         
        <div className="container pb-5">
        <h1>UPDATE POST</h1>
        {showUpdateForm()}
    </div>
      )
    }


export default UpdatePost