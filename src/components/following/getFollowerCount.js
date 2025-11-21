import React from "react";
import "./followingSheet.css";

// FollowingCount now just displays the count passed as a prop
export default function FollowerCount({ count }) {
  return <div>Following {count || 0}</div>;
}
