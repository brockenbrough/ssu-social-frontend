import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Image from "react-bootstrap/Image";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox as inboxIcon } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus as createIcon } from "@fortawesome/free-solid-svg-icons";
import { faStar as forYouIcon } from "@fortawesome/free-solid-svg-icons";
import { faCompass as discoverIcon } from "@fortawesome/free-solid-svg-icons";
import { faUser as profileIcon } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./post/createPost";
import DarkModeButton from "./DarkModeButton";
import Notification from "./notification/Notification";

export default function Navbar() {
  const [user, setUser] = useState(getUserInfo());
  const [popupShow, setPopupShow] = useState(false);
  const [inboxPopupShow, setInboxPopupShow] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userInfo = getUserInfo();
    fetchNotifications(userInfo.username);
    setUser(userInfo);
  }, []);

  const fetchNotifications = async (username) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/notification/${username}`
      );

      const notifications = response.data.notifications;
      setNotifications(notifications);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInboxClick = () => {
    setInboxPopupShow(!inboxPopupShow);
  };

  return (
    <>
      <div className="sidebar-navbar">
        <div>
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s"
            rounded
            className="w-16 ml-auto mr-auto mt-3"
          />
          <div className="font-title text-xl mt-2 mb-5 text-center font-bold text-orange-600">
            SSU Social
          </div>
        </div>

        {/* Create Inbox Button */}
        <span className="ssu-nav-link group" onClick={() => handleInboxClick()}>
          <span>
            <FontAwesomeIcon
              className="mr-3 text-orange-500 group-hover:text-white"
              icon={inboxIcon}
            />
            <span>Inbox</span>

            {notifications.length > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-7 ml-6 text-center text-xs font-medium text-white bg-orange-500 rounded-full group-hover:bg-gray-800">
                {notifications.length}
              </span>
            )}
          </span>
        </span>

        {/* Create Post Button */}
        <span className="ssu-nav-link group">
          <CreatePost popupShow={popupShow} setPopupShow={setPopupShow} />
          <span onClick={() => setPopupShow(true)}>
            <FontAwesomeIcon
              className="mr-3 text-orange-500 group-hover:text-white"
              icon={createIcon}
            />
            <span>Create Post</span>
          </span>
        </span>

        {/* Direct Links Instead of Dropdown */}
        <a href="/feed-algorithm" className="ssu-nav-link group">
          <FontAwesomeIcon
            className="mr-3 text-orange-500 group-hover:text-white"
            icon={forYouIcon}
          />
          <span>For You</span>
        </a>
        <a href="/getallpost" className="ssu-nav-link group">
          <FontAwesomeIcon
            className="mr-3 text-orange-500 group-hover:text-white"
            icon={discoverIcon}
          />
          <span>Discover</span>
        </a>
        <a href="/privateUserProfile" className="ssu-nav-link group">
          <FontAwesomeIcon
            className="mr-3 text-orange-500 group-hover:text-white"
            icon={profileIcon}
          />
          <span>Profile</span>
        </a>

        {/* Dark Mode Button */}
        <div style={{ marginTop: "auto", padding: "20px" }}>
          <DarkModeButton />
        </div>
      </div>
      {/* Notification Popup */}
      {inboxPopupShow && (
        <Notification
          notifications={notifications}
          setNotifications={setNotifications}
          handleHideNotificationPopup={() => setInboxPopupShow(false)}
        />
      )}
    </>
  );
}
