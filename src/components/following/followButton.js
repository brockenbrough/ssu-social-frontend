import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";
import "./followingSheet.css";
import apiClient from "../../utilities/apiClient";

export default function FollowButton({ targetUserId, username, initialFollowing = false, onUpdateFollowerCount }) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const loggedInUser = getUserInfo();

  // helper to update follower count from server
  const fetchFollowerCount = async (targetUserId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${targetUserId}`
      );
      return response.data[0]?.followers.length || 0;
    } catch (error) {
      console.error(`Error fetching follower count: ${error.message}`);
      return 0;
    }
  };

  // follow action
  async function followUser() {
    try {
      const data = {
        userId: loggedInUser.username,
        targetUserId: targetUserId,
      };
      const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/follow`;
      const res = await axios.post(url, data);

      if (res.status === 200) {
        setIsFollowing(true);

        const updatedFollowerCount = await fetchFollowerCount(targetUserId);
        onUpdateFollowerCount(updatedFollowerCount);

        // only attempt to save notification if we have a logged-in user and it's not the same
        if (loggedInUser?.username && loggedInUser.username !== targetUserId) {
          try {
            await apiClient.post(`/notification`, {
              type: "follow",
              username: targetUserId,
              actionUsername: loggedInUser.username,
              text: `@${loggedInUser.username} followed you.`,
            });
          } catch (err) {
            console.error("Error saving follow notification:", err);
          }
        }
      } else {
        throw new Error("Failed to follow the user");
      }
    } catch (error) {
      console.error("Error following the user:", error);
    }
  }

  // unfollow action
  async function unfollowUser() {
    try {
      const unFollow = {
        userId: loggedInUser.username,
        targetUserId: targetUserId,
      };
      const url = `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/unfollow`;
      const res = await axios.delete(url, { data: unFollow });

      if (res.status === 200) {
        setIsFollowing(false);

        const updatedFollowerCount = await fetchFollowerCount(targetUserId);
        onUpdateFollowerCount(updatedFollowerCount);
      } else {
        console.error("Failed to unfollow the user");
      }
    } catch (error) {
      console.error("Error unfollowing the user:", error);
    }
  }

  function MainFollowButton() {
    const buttonStyles = {
      padding: "8px 16px",
      fontSize: "1rem",
      width: "auto",
      height: "auto",
      minWidth: "100px",
    };

    if (isFollowing) {
      return (
        <button
          className="ssu-button-primary"
          style={buttonStyles}
          id="unfollowButton"
          onClick={unfollowUser}
        >
          <span className="message">Following</span>
        </button>
      );
    } else {
      return (
        <button
          className="ssu-button-primary"
          style={buttonStyles}
          id="followButton"
          onClick={followUser}
        >
          Follow
        </button>
      );
    }
  }

  // don't show follow button for self
  return <div>{username !== targetUserId ? <MainFollowButton /> : <div />}</div>;
}
