//This is a comment about imports
import React, { useEffect, useState} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useParams} from "react-router";
// import PublicUser from './PublicUser';
// import FollowButton from "../following/followButton";
import getUserInfo from '../../utilities/decodeJwt'
// import Comment from '../comments/comment'
// import CommentList from "../comments/commentListPage";
// import Feed from '../feed/Feed'
// import PostList from '../post/feedPage'
// import Card from 'react-bootstrap/Card';
import { Button } from "react-bootstrap";
import axios from 'axios'
import Post from "../post/post";
import FollowButton from '../following/followButton'

// The PublicUserList component.  This is the main component in this file.
// 1. function PublicUserList
export default function PublicUserList() {
  const [user, setUser] = useState({})
  const {username} = useParams();
  const [commentListRouteChange, setcommentListRouteChange] = useState([])
 
  const [posts, setPosts] = useState([])
 
  const fetchPosts = async () => {
	  const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`)
		  .then(res => {
			  setPosts(res.data)
		  })
		  .catch(error => alert(`Unable to fetch posts: ${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/getAllByUsername/${username}`))
	}

  // 2. function getUserId
  useEffect(() => {

    fetchPosts()
    getUserInfo(); // Now that we defined it, call the function.
    setUser(getUserInfo());
    
    return; 
  }, []);  // If record length ever changes, this useEffect() is automatically called.
 

    if (user)
    return (
      <div>
     <FollowButton username = {user.username} targetUserId = {username}/>
            {posts.map((posts, index) => {
              
              return (<Post posts={posts}
                 />)
            })}
             </div>
             
    );
    
    
}
  

