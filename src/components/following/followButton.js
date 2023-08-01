import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import getUserInfo from '../../utilities/decodeJwt'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import './followingSheet.css'


// The FollowButton component.  This is the main component in this file. We will talk to the user team to implement this component.
export default function FollowButton(props) {

  //Hopefully this got added.


  const routeChange = () =>{ 
    navigate("/editUserPage");
  } 


  const [user, setUser] = useState([])
  const [isFollowingBool, setIsFollowing] = useState()
  const params = useParams();
  const [followersState, setFollowers] = useState([]);
  let navigate = useNavigate()


useEffect(() => {setUser(getUserInfo())}, []) // Get user's info

  // A method to follow a user. Take the id from the params in the link.

  async function followUser() {

    console.log(props.username+ " followed " +props.targetUserId)

    const addFollowing = {
      userId: props.username,
      targetUserId: props.targetUserId,
    }
    const url = "http://localhost:8095/followers/follow";

    const res = await axios.post(url, addFollowing)
    setIsFollowing(true); // Follow state, to true. Sets the button UI view.

  }

  // A method to follow a user. Take the id from the params in the link.

  async function unfollowUser() {

   console.log(props.username+ " unfollowed " +props.targetUserId)

    const unFollow = {
      userId: props.username,
      targetUserId: props.targetUserId,
    }
    const url = "http://localhost:8095/followers/unfollow";

    const res = await axios.delete(url, {
      data: unFollow,
    })

    setIsFollowing(false); // Follow state, to false Sets the button UI view.

  }



  // This function is very important, it helps figure out which state the button should be in.
  useEffect(() => {
    async function isFollowing() {


    const response = await fetch(
      `http://localhost:8095/followers/${props.targetUserId}`
    );

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

      try {
        const fetchedFollowers = await response.json();

        setFollowers(fetchedFollowers[0].followers);

        if (followersState.find((x) => x === props.username)) {
          setIsFollowing(true); // Follow state, to true. Sets the button UI view.
        } else {
          setIsFollowing(false); // Follow state, to false. Sets the button UI view.
        }
      } catch (error) {
        console.log("User doesn't exist in follower's collection yet.");
        setIsFollowing(false); // Follow state, to false. Sets the button UI view.
      }


    } 
    
    isFollowing();
    return;
  }, [followersState.length]);



  function MainFollowButton(){ // Main follow button to follow a user or unfollow a user.
    if (isFollowingBool){            
      return <Button variant="outline-primary" id="unfollowButton" size="lg"  onClick={(e) => unfollowUser()}><span class="message">Following</span></Button>
    }
    else{
      return <Button id="followButton" size="lg" onClick={(e) => followUser()}>Follow</Button>
    }
  }



  //if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

  // Returns the unfollow button or the follow button depending on the IsFollowing() state. Also shows an Edit Profile Button if the user is viewing their own profile.
  return (
    <div>
    {props.username === props.targetUserId ? <Button id="editProfileButton" onClick={routeChange} size="lg">Edit Profile</Button> : <MainFollowButton/>}
    </div>
  );
}
