import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import getUserInfo from '../../utilities/decodeJwt'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import FollowButton from './followButton.js';
import { Link } from 'react-router-dom';


// The FollowerList component.  This is the main component in this file.
export default function FollowerList() {
  const [user, setUser] = useState({})
  const [followers, setFollowers] = useState([]);
  const params = useParams();
  const [error, setError] = useState({});
  
  // This method fetches the user's followers from the database.
  useEffect(() => {
    async function getFollowers() {
        
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${params.id.toString()}`);
      
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      
      try{
      const fetchedFollowers = await response.json();

      setFollowers(fetchedFollowers[0].followers);  // update state.  when state changes, we automatically re-render.
      }catch(error){
        setError(error)
      }
      
    }
    
    getFollowers();   
    setUser(getUserInfo())
    
    return; 
  }, [followers.length]);  
  
  // A method to delete a follower.
  async function deleteFollower(userId, targetUserId) {
    const deleteFollower = {
        userId: userId,
        targetUserId: targetUserId,
      }
    const url = "http://localhost:8095/followers/unfollow";

    await axios.delete(url, {
        data: deleteFollower,
      })
      
    const newFollowers = followers.filter((el) => el !== el); // This causes a re-render because we change state. Helps cause a re-render.
    setFollowers(newFollowers);  // This causes a re-render because we change state.
  }

  const Follower = ({record, user, deletePerson}) => (
    <tr>
      <td className="fs-4"><Link to={`/publicProfilePage/${record}`} style={{ textDecoration: 'none', color: 'black'}}>{record}</Link></td>
      <td>{user.username != record ? <FollowButton username={user.username} targetUserId={record}/>: <p></p> }</td>
      {user.username == params.id.toString() ? <td><Button variant="danger" size="lg"onClick={() => {deletePerson(record);}}>Delete</Button></td> : <p></p>}
    </tr>
  );
  

  function followerList() {
    return followers.map((record) => {
      return (
        <Follower record={record} deletePerson={() => deleteFollower(record, params.id.toString())}key={record} user={user}/>);
    });
  }

  function errorMessage() {
   
      return (
        <h6 style = {{color: 'red'}}>Error Occurred! User could exist, but not in the Follower's Collection yet. GET SOME FOLLOWERS!</h6>);
      }

  //if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

  // This following section will display the table with the records of individuals and all their followers.
  return (
    <div>
      {error.message ? errorMessage() : <p></p>}
      <h2 style={{ marginLeft: 30 }}>Followers</h2>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{followerList()}</tbody>
      </table>
    </div>
  );
}