import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router"; // Import useNavigate
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";
import Button from "react-bootstrap/Button";
import FollowButton from "./followButton.js";
import { Link } from "react-router-dom";
import { useDarkMode } from "../DarkModeContext"; // Import dark mode hook

// The FollowingList component.  This is the main component in this file.
export default function FollowingList() {
  const [user, setUser] = useState();
  const [followings, setFollowing] = useState([]);
  const params = useParams();
  const [error, setError] = useState({});
  const { darkMode } = useDarkMode(); // Get dark mode state
  const navigate = useNavigate(); // Initialize the navigate hook
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    // Define a function to get the user's following. People that they follow.
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
        setFollowing(fetchedFollowing[0].following); // update state.  when state changes, we automatically re-render.
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
    <tr>
      <td className="fs-4">
        <Link
          to={`/publicProfilePage/${record}`}
          style={{ textDecoration: "none", color: darkMode ? "#fff" : "#000" }}
        >
          {record}
        </Link>
      </td>
      <td>
        {user.username !== record ? (
          <FollowButton
            username={user.username}
            targetUserId={record}
            onUpdateFollowerCount={updateFollowerCount}
          />
        ) : (
          <p></p>
        )}
      </td>
    </tr>
  );

  // This method will map out the records on the table.
  function followingList() {
    console.log(user);
    console.log(params.id.toString());
    return followings.map((record) => {
      return <Following record={record} key={record} user={user} />;
    });
  }

  function errorMessage() {
    return (
      <h6 style={{ color: "red" }}>
        Error Occurred! User could exist, but not in the Following's Collection
        yet. GO FOLLOW SOME PEOPLE!
      </h6>
    );
  }

  // Back button handler to go to the profile page
  function handleBack() {
    navigate(`/privateUserProfile`);
  }

  // This following section will display the table with the user's following. People that they are following.
  return (
    <div
      style={{
        backgroundColor: darkMode ? "#000" : "#f6f8fa",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        paddingLeft: "170px", // Add left padding to ensure it's not hidden under the sidebar
      }}
    >
      {/* Flex container for Back to Profile and Followers/Following buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 30px",
        }}
      >
        {/* Back to Profile button aligned to the left */}
        <Button variant={darkMode ? "dark" : "secondary"} onClick={handleBack}>
          Back to Profile
        </Button>

        {/* Followers and Following buttons centered */}
        <div style={{ margin: "auto" }}>
          {/* Followers Button */}
          <Link to={`/followers/${params.id}`}>
            <Button
              variant={darkMode ? "dark" : "primary"}
              style={{ marginRight: "10px", cursor: "default" }}
            >
              Followers
            </Button>
          </Link>

          {/* Following Button: Disabled when on Following page */}
          <Button
            variant={darkMode ? "secondary" : "light"}
            disabled
            style={{ marginRight: "10px", cursor: "default", opacity: 0.7 }}
          >
            Following
          </Button>
        </div>
      </div>

      {/* Error message or placeholder area */}
      <div
        style={{
          color: darkMode ? "#fff" : "#000",
          padding: "10px",
          backgroundColor: darkMode ? "#000" : "#f6f8fa",
          minHeight: "50px",
        }}
      >
        {error.message ? errorMessage() : <p>&nbsp;</p>}{" "}
        {/* Non-breaking space to ensure visibility */}
      </div>

      <h2 style={{ marginLeft: 30 }}>Following</h2>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ color: darkMode ? "#fff" : "#000" }}>Name</th>{" "}
            {/* Conditional styling for 'Name' */}
          </tr>
        </thead>
        <tbody>{followingList()}</tbody>
      </table>
    </div>
  );
}