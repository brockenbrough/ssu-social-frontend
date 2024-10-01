import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import getUserInfo from "../utilities/decodeJwt";
import Image from "react-bootstrap/Image";
import { useDarkMode } from "../components/DarkModeContext";
import CreatePost from "./post/createPost";
import DarkModeButton from "./DarkModeButton"; // Import your Dark Mode button

export default function Navbar() {
  const [user, setUser] = useState(getUserInfo());
  const [popupShow, setPopupShow] = useState(false);
  const { darkMode } = useDarkMode();
  const location = useLocation();

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  return (
    <div className={`sidebar-navbar ${darkMode ? "dark" : "bg-cream"}`}>
      <div style={{ padding: "20px" }}>
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s"
          rounded
          className="mr-2"
          style={{ width: "60px", height: "60px", marginLeft: '30px' }}
        />
        <span className={`navbar-brand ${darkMode ? "text-light" : "text-dark"}`}
        style={{ fontSize: "1.5rem" }}>
          
          SSU Social
        </span>
      </div>

      {/* Create Post Button */}
      <span style={{ color: darkMode ? "#fff" : "#000", cursor: "pointer", marginBottom: "20px", fontSize: "1.2rem", marginLeft:"0.8rem" }}>
        <CreatePost popupShow={popupShow} setPopupShow={setPopupShow} />
        <span onClick={() => setPopupShow(true)}>
          Create Post <span style={{ fontSize: "1.2rem", marginLeft: "5px" }}>+</span>
        </span>
      </span>

      {/* Direct Links Instead of Dropdown */}
      <div className="flex flex-col mb-4">
  <a href="/feed-algorithm" className={`sidebar-item ${darkMode ? "text-light" : "text-dark"} no-underline`}>
    For You
  </a>
  <a href="/getallpost" className={`sidebar-item ${darkMode ? "text-light" : "text-dark"} no-underline`}>
    Discover
  </a>
  <a href="/privateUserProfile" className={`sidebar-item ${darkMode ? "text-light" : "text-dark"} no-underline`}>
    Profile
  </a>
</div>

      {/* Dark Mode Button */}
      <div style={{ marginTop: 'auto', padding: '20px' }}>
        <DarkModeButton />
      </div>
    </div>
  );
}
