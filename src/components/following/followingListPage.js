import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import getUserInfo from "../../utilities/decodeJwt";
import FollowButton from "./followButton.js";
import { Link } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext";

export default function FollowingList() {
  const [user, setUser] = useState({});
  const [followings, setFollowing] = useState([]);
  const params = useParams();
  const [error, setError] = useState({});
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    async function getFollowing() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/following/${params.id.toString()}`
      );

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      try {
        const fetchedFollowing = await response.json();
        setFollowing(fetchedFollowing[0].following); // Update state. When state changes, we automatically re-render.
      } catch (error) {
        setError(error);
      }
    }

    getFollowing();
    setUser(getUserInfo());

    return;
  }, [followings.length]); // If record length ever changes, this useEffect() is automatically called.

  const updateFollowerCount = (newFollowerCount) => {
    setFollowerCount(newFollowerCount);
  };

  const Following = ({ record, user }) => (
    <tr className="h-16">
      <td className="flex items-center justify-between px-4" style={{ minWidth: '200px' }}>
        <Link
          to={`/publicProfilePage/${record}`}
          className={`text-${darkMode ? 'white' : 'black'} text-xl`}
          style={{ textDecoration: 'none' }}
        >
          @{record}
        </Link>

        <div className="flex items-center justify-center space-x-2">
          {user.username !== record && (
            <FollowButton
              username={user.username}
              targetUserId={record}
              onUpdateFollowerCount={updateFollowerCount}
            />
          )}
        </div>
      </td>
    </tr>
  );

  // This method will map out the records on the table.
  function followingList() {
    return followings.map((record) => {
      return <Following record={record} key={record} user={user} />;
    });
  }

  function errorMessage() {
    return (
      <h6 style={{ color: "red" }}>
        Error Occurred! User could exist, but not in the Following's Collection yet. GO FOLLOW SOME PEOPLE!
      </h6>
    );
  }

  // Back button handler to go to the profile page
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
            <Link to={`/followers/${params.id}`}>
              <button
                className="ssu-button-primary"
                style={{
                  padding: '9px 15px',
                  fontSize: '1.15rem',
                }}
              >
                Followers
              </button>
            </Link>
            <button
              className="ssu-button-disabled"
              disabled
              style={{
                padding: '9px 15px',
                fontSize: '1.15rem',
              }}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      <div className="py-2">
        {error.message ? errorMessage() : <p>&nbsp;</p>}
      </div>

      <h2 className="font-bold text-2xl ml-6">Following</h2>
      <table className="table table-striped mt-5">
        <tbody>{followingList()}</tbody>
      </table>
    </div>
  );
}
