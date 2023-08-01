
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import getUserInfo from '../../utilities/decodeJwt'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import FollowButton from './followButton.js';
import { Link } from 'react-router-dom';

// The FollowingList component.  This is the main component in this file.
export default function FollowingList() {


  const [user, setUser] = useState()
  const [followings, setFollowing] = useState([]);
  const params = useParams();
  const [error, setError] = useState({});

  useEffect(() => {
    // Define a function to get the user's following. People that they follow.
    async function getFollowing() {

      const response = await fetch(`http://localhost:8095/following/${params.id.toString()}`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      try{

      const fetchedFollowing = await response.json();

      setFollowing(fetchedFollowing[0].following);  // update state.  when state changes, we automatically re-render.
      }catch(error){
        setError(error)
      }

    }

    getFollowing();   
    setUser(getUserInfo())

    return;
  }, [followings.length]);  // If record length ever changes, this useEffect() is automatically called.

  // A method to unfollow a user from the following list.

  // async function deleteFollowing(userId, targetUserId) {
  //   const deleteFollowing = {
  //     userId: userId,
  //     targetUserId: targetUserId,
  //   }
  //   const url = "http://localhost:8095/followers/unfollow";

  // await axios.delete(url, {
  //   data: deleteFollowing,
  // });
      
  //   const newFollowing = followings.filter((el) => el !== el); // This causes a re-render because we change state.
  //   setFollowing(newFollowing);  // This causes a re-render because we change state.
  // }


  const Following = ({ record, user}) => (
    <tr>
      <td className="fs-4"><Link to={`/publicProfilePage/${record}`} style={{ textDecoration: 'none', color: 'black'}}>{record}</Link></td>
      <td>{user.username != record ? <FollowButton username={user.username} targetUserId={record}/>: <p></p> }</td>
    </tr>
  );

  // This method will map out the records on the table.
  function followingList() {
    console.log(user)
    console.log(params.id.toString())
      return followings.map((record) => {
        return (
          <Following record={record} key={record} user={user} />);
      });
    }

    function errorMessage() {
   
      return (
        <h6 style = {{color: 'red'}}>Error Occurred! User could exist, but not in the Following's Collection yet. GO FOLLOW SOME PEOPLE!</h6>);
      }

  //if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

  // This following section will display the table with the user's following. People that they are following.

  return (
    <div>
      {error.message ? errorMessage() : <p></p>}
      <h2 style={{ marginLeft: 30 }}>Following</h2>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{followingList()}</tbody>
      </table>
    </div>
  );
}
