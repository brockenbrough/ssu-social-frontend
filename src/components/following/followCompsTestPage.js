import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Button from 'react-bootstrap/Button';
import FollowButton from './followButton.js';
import FollowingCount from './getFollowingCount.js';
import FollowerCount from './getFollowerCount.js';
import './followingSheet.css'
import getUserInfo from '../../utilities/decodeJwt'


// Test page for the following service components.
export default function TestPage() {

  const [user, setUser] = useState([])

  useEffect(() => {setUser(getUserInfo())}, []) // Get user's info

    let navigate = useNavigate() 

    const followerRouteChange = () =>{ 
      navigate(`/followers/${params.id.toString()}`); // To use in the follower's button to switch to the user's follower's list.
    }

    const followingRouteChange = () =>{ 
        navigate(`/following/${params.id.toString()}`); // To use in the following button to switch to the user's following list.
      }

  const params = useParams(); // MUST ALWAYS USE PARAMS to gather info from the following and follower collections.

  //if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)



  // Returns the Profile name, FollowButton which would be the follow button, unfollow button or Edit Profile button.
  // Returns a Button with the followerCount and you can click it to go to the Follower list of the user.
  // Returns a Button with the followingCount and you can click it to go to the Following list of the user.
  return (
    <div id="followPage">
    <h1>Profile Name: {params.id.toString()}</h1>
    <h1>Logged in: {user.username}</h1>
    <FollowButton username={user.username} targetUserId={params.id.toString()}/>
    <br></br>
    <Button onClick={followerRouteChange}><FollowerCount username={params.id.toString()}/></Button> <Button onClick={followingRouteChange}><FollowingCount username={params.id.toString()}/></Button>
    </div>
  );
}