import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Image from "react-bootstrap/Image";
import { useDarkMode } from "../components/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus as createIcon } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./post/createPost";
import DarkModeButton from "./DarkModeButton";

export default function Navbar() {
  const [user, setUser] = useState(getUserInfo());
  const [popupShow, setPopupShow] = useState(false);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  return (
    <div className="sidebar-navbar">
      <div>
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s"
          rounded
          className="w-16 ml-auto mr-auto mt-3"
        />
        <div className="font-title text-xl mt-2 mb-5 text-center font-bold text-gray-900 dark:text-white">
          SSU Social
        </div>
      </div>

      {/* Create Post Button */}
      <span className="ssu-nav-link group">
        <CreatePost popupShow={popupShow} setPopupShow={setPopupShow} />
        <span onClick={() => setPopupShow(true)}>
          <span className="mr-2">Create Post</span>
          <FontAwesomeIcon
            className="text-orange-500 group-hover:text-white"
            icon={createIcon}
          />
        </span>
      </span>

      {/* Direct Links Instead of Dropdown */}
      <a href="/feed-algorithm" className="ssu-nav-link">
        For You
      </a>
      <a href="/getallpost" className="ssu-nav-link">
        Discover
      </a>
      <a href="/privateUserProfile" className="ssu-nav-link">
        Profile
      </a>

      {/* Dark Mode Button */}
      <div style={{ marginTop: "auto", padding: "20px" }}>
        <DarkModeButton />
      </div>
    </div>
  );
}
