import React, { useEffect, useState } from "react";
import "./followingSheet.css";

// The FollowerCount component.  This is the main component in this file.

export default function FollowerCount(props) {
  const [followState, setFollowerCount] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    // Gets the follower count of the user.
    async function getFollowerCount() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/followers/${props.username}`
      );

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      try {
        const fetchedFollowers = await response.json();

        setFollowerCount(fetchedFollowers[0].followers); // Sets the fetched followers of the user.
      } catch (error) {
        setError(error);
      }
    }

    getFollowerCount();

    return;
  }, [followState.length]);

  // This function is very important, it returns the follower count.

  function FollowersCount() {
    if (followState.length > 0) {
      return followState.length;
    } else {
      return 0;
    }
  }

  //if (!user) return (<div><h3>You are not authorized to view this page, Please Login in <Link to={'/login'}><a href='#'>here</a></Link></h3></div>)

  // Returns the Follower count of the user.
  return (
    <div>
      <FollowersCount /> Followers
    </div>
  );
}
