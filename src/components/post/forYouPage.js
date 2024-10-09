import React from "react";
import { Link } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwt";
import PostList from "./postlist";
import { useDarkMode } from "../DarkModeContext";

function ForYouPage() {
  const { darkMode } = useDarkMode();
  const user = getUserInfoAsync();

  if (!user) {
    return (
      <div
        style={{
          backgroundColor: darkMode ? "#000" : "#f6f8fa",
          color: darkMode ? "#fff" : "#000",
          minHeight: "100vh",
          paddingLeft: "170px", // Ensure content isn't hidden by the sidebar
        }}
      >
        <h3>
          You are not authorized to view this page. Please Login in{" "}
          <Link to="/login" style={{ color: darkMode ? "#00f" : "#007bff" }}>
            here
          </Link>
        </h3>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#000" : "#f6f8fa",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        paddingLeft: "170px", // Ensure content isn't hidden by the sidebar
      }}
    >
      <h2 style={{ textAlign: "center" }}>For you</h2>
      <PostList type="feed" username={user.username} darkMode={darkMode} />
    </div>
  );
}

export default ForYouPage;
