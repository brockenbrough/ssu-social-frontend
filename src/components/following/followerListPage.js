import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";
import FollowButton from "./followButton.js";
import { Link } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";

export default function FollowerList() {
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const params = useParams();
  const [error, setError] = useState({});
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    async function getFollowers() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${params.id.toString()}`
      );

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      try {
        const fetchedFollowers = await response.json();
        setFollowers(fetchedFollowers[0].followers);
      } catch (error) {
        setError(error);
      }
    }

    getFollowers();
    setUser(getUserInfo());

    return;
  }, [followers.length]);

  async function deleteFollower(userId, targetUserId) {
    const deleteFollower = {
      userId: userId,
      targetUserId: targetUserId,
    };
    const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/unfollow`;

    await axios.delete(url, {
      data: deleteFollower,
    });

    const newFollowers = followers.filter((el) => el !== el);
    setFollowers(newFollowers);
  }

  const updateFollowerCount = (newFollowerCount) => {
    setFollowerCount(newFollowerCount);
  };

  const Follower = ({ record, user, deletePerson }) => (
    <tr className="h-16"> 
      <td className="flex items-center justify-between px-4" style={{ minWidth: '200px' }}>
        <Link
          to={`/publicProfilePage/${record}`}
          className={`text-${darkMode ? 'white' : 'black'} text-xl`}
          style={{ textDecoration: 'none' }}
        >
          {record}
        </Link>
  
        
        <div className="flex items-center justify-center space-x-2">
          {user.username !== record && (
            <FollowButton
              username={user.username}
              targetUserId={record}
              onUpdateFollowerCount={updateFollowerCount}
            />
          )}

          {user.username === params.id.toString() && (
            <button
              className="ssu-button-caution"
              style={{
                padding: '8px 16px',
                fontSize: '1rem',
                width: 'auto',
                height: 'auto',
                minWidth: '100px',
              }}
              onClick={() => {
                deletePerson(record);
              }}
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );  
       
  function followerList() {
    return followers.map((record) => {
      return (
        <Follower
          record={"@"+record}
          deletePerson={() => deleteFollower(record, params.id.toString())}
          key={record}
          user={user}
        />
      );
    });
  }

  function errorMessage() {
    return (
      <h6 style={{ color: "red" }}>
        Error Occurred! User could exist, but not in the Follower's Collection
        yet. GET SOME FOLLOWERS!
      </h6>
    );
  }

  function handleBack() {
    navigate(`/privateUserProfile`);
  }

  return (
    <div className="dark:bg-gray-800 text-gray-900 dark:text-white min-h-screen pl-40">
      <div className="flex items-center py-4 px-10">
      <button
        className="ssu-button-info-clickable"
        onClick={handleBack}
        style={{
          padding: '9px 15px',
          fontSize: '1.15rem',
        }}
      >
        ← Back to Profile
      </button>

      <div className="flex-grow flex justify-center mx-4">
        <div className="flex space-x-2">
          <button
            className="ssu-button-disabled"
            disabled
            style={{
              padding: '9px 15px',
              fontSize: '1.15rem',
            }}
          >
            Followers
          </button>
          <Link to={`/following/${params.id}`}>
            <button
              className="ssu-button-primary"
              style={{
                padding: '9px 15px',
                fontSize: '1.15rem',
              }}
            >
              Following
            </button>
          </Link>
        </div>
      </div>
    </div>

      <div className="py-2">
        {error.message ? errorMessage() : <p>&nbsp;</p>}
      </div>

      <h2 className="font-bold text-2xl ml-6">Followers</h2>
      <table className="table table-striped mt-5">
        <tbody>{followerList()}</tbody>
      </table>
    </div>
  );
}
