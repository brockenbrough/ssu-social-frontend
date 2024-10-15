import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";
import FollowButton from "./followButton.js";
import { Link } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext"; // Import dark mode hook

// The FollowerList component.  This is the main component in this file.
export default function FollowerList() {
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const params = useParams();
  const [error, setError] = useState({});
  const { darkMode } = useDarkMode(); // Get dark mode state
  const navigate = useNavigate(); // Initialize the navigate hook
  const [followerCount, setFollowerCount] = useState(0);

  // This method fetches the user's followers from the database.
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
        setFollowers(fetchedFollowers[0].followers); // update state.  when state changes, we automatically re-render.
      } catch (error) {
        setError(error);
      }
    }

    getFollowers();
    setUser(getUserInfo());

    return;
  }, [followers.length]);

  // A method to delete a follower.
  async function deleteFollower(userId, targetUserId) {
    const deleteFollower = {
      userId: userId,
      targetUserId: targetUserId,
    };
    const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/unfollow`;

    await axios.delete(url, {
      data: deleteFollower,
    });

    const newFollowers = followers.filter((el) => el !== el); // This causes a re-render because we change state. Helps cause a re-render.
    setFollowers(newFollowers); // This causes a re-render because we change state.
  }

  const updateFollowerCount = (newFollowerCount) => {
    setFollowerCount(newFollowerCount);
  };

  const Follower = ({ record, user, deletePerson }) => (
    <tr className="h-16"> {/* Adjust this height to match your button height */}
      <td className="flex items-center justify-between px-4" style={{ minWidth: '200px' }}>
        <Link
          to={`/publicProfilePage/${record}`}
          className={`text-${darkMode ? 'white' : 'black'} text-xl`}
          style={{ textDecoration: 'none' }}
        >
          {record}
        </Link>
  
        {/* Wrapper for buttons to center them */}
        <div className="flex items-center justify-center space-x-2"> {/* Flexbox for centering */}
          {/* Follow button */}
          {user.username !== record && (
            <FollowButton
              username={user.username}
              targetUserId={record}
              onUpdateFollowerCount={updateFollowerCount}
            />
          )}
  
          {/* Delete button */}
          {user.username === params.id.toString() && (
            <button
              className="ssu-button-caution" // Centered without margin
              style={{
                padding: '8px 16px', // Increased padding for a larger button
                fontSize: '1rem', // Larger font size
                width: 'auto', // Ensure auto width to fit the text
                height: 'auto', // Ensure auto height to fit the content
                minWidth: '100px', // Set a minimum width for better button size
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
          record={record}
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

  // Back button handler to go to the profile page
  function handleBack() {
    navigate(`/PrivateUserProfile/`);
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

      {/* This div allows the buttons to flexibly adjust their position */}
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
