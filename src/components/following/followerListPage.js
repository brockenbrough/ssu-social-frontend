import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";
import Button from "react-bootstrap/Button";
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
      {user.username === params.id.toString() ? (
        <td>
          <Button
            variant="danger"
            size="lg"
            onClick={() => {
              deletePerson(record);
            }}
          >
            Delete
          </Button>
        </td>
      ) : (
        <p></p>
      )}
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
    navigate(`/privateUserProfile`); // Replace with the actual route for the profile page
  }

  // This following section will display the table with the records of individuals and all their followers.
  return (
    <div
      style={{
        backgroundColor: darkMode ? "#000" : "#f6f8fa",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        paddingLeft: "170px", // Add left padding to ensure it's not hidden under the sidebar
      }}
    >
      {/* Flex container for the Back to Profile and Followers/Following buttons */}
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
          {/* Followers Button: Disabled when on Followers page */}
          <Button
            variant={darkMode ? "secondary" : "light"}
            disabled
            style={{ marginRight: "10px", cursor: "default", opacity: 0.7 }}
          >
            Followers
          </Button>

          {/* Following Button */}
          <Link to={`/following/${params.id}`}>
            <Button variant={darkMode ? "dark" : "primary"}>Following</Button>
          </Link>
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
        {error.message ? errorMessage() : <p>&nbsp;</p>}
      </div>

      {/* Followers section */}
      <h2 style={{ marginLeft: 30 }}>Followers</h2>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ color: darkMode ? "#fff" : "#000" }}>Name</th>{" "}
            {/* Conditional styling for 'Name' */}
          </tr>
        </thead>
        <tbody>{followerList()}</tbody>
      </table>
    </div>
  );
}