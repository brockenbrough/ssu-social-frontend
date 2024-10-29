import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Image from "react-bootstrap/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox as inboxIcon } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus as createIcon } from "@fortawesome/free-solid-svg-icons";
import { faStar as forYouIcon } from "@fortawesome/free-solid-svg-icons";
import { faCompass as discoverIcon } from "@fortawesome/free-solid-svg-icons";
import { faUser as profileIcon } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass as searchButton } from "@fortawesome/free-solid-svg-icons";
import apiClient from "./../utilities/apiClient";
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
      const response = await apiClient.get(`/notification/${username}`);

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
      <div className="sidebar-navbar sm:w-18 md:w-18 lg:w-34">
        <div className="flex flex-col items-start md:items-center">
          {" "}
          {/* Changed items-center to items-start for small screens */}
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s"
            rounded
            className="mr-1 w-12 mt-6 lg:w-18 ml-[10px] mb-3" // Remove ml-0 and mr-auto for small screens
          />
          <div className="mt-2 mb-5 text-xl font-bold text-center text-iconBorder font-title hidden md:block">
            {" "}
            {/* Hidden on small screens */}
            SSUSocial
          </div>
        </div>

        {/* Create Post Button */}
        <span className="ssu-nav-link group">
          <CreatePost popupShow={popupShow} setPopupShow={setPopupShow} />
          <span onClick={() => setPopupShow(true)}>
            <FontAwesomeIcon
              className="mr-4 text-lightMainText dark:text-darkMainText group-hover:text-white"
              icon={createIcon}
            />
            <span className="hidden md:inline">Create Post</span>
          </span>
        </span>

        {/* Direct Links Instead of Dropdown */}
        <a
          href="/searchPage"
          className="ssu-nav-link group flex items-center justify-start"
        >
          <FontAwesomeIcon
            className="mr-4 text-lightMainText dark:text-darkMainText group-hover:text-white"
            icon={searchButton}
          />
          <span className="hidden md:inline">Search</span>
        </a>

        <a
          href="/feed-algorithm"
          className="ssu-nav-link group flex items-center"
        >
          <FontAwesomeIcon
            className="mr-4 text-lightMainText dark:text-darkMainText group-hover:text-white"
            icon={forYouIcon}
          />
          <span className="hidden md:inline">For You</span>{" "}
          {/* Text hidden on small screens */}
        </a>
        <a href="/getallpost" className="ssu-nav-link group flex items-center">
          <FontAwesomeIcon
            className="mr-4 text-lightMainText dark:text-darkMainText group-hover:text-white"
            icon={discoverIcon}
          />
          <span className="hidden md:inline">Discover</span>{" "}
          {/* Text hidden on small screens */}
        </a>

        {/* Create Inbox Button */}
        <span
          className="ssu-nav-link group flex items-center"
          onClick={() => handleInboxClick()}
        >
          <span className="flex items-center">
            <div className="relative mr-1">
              <FontAwesomeIcon
                className="mr-3 text-lightMainText dark:text-darkMainText group-hover:text-white"
                icon={inboxIcon}
              />
              {/* Notification count */}
              {notifications.filter((n) => n.isRead === false).length > 0 && (
                <span className="absolute -top-2 -right-0 bg-red-600 text-white text-xs font-normal rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter((n) => n.isRead === false).length}
                </span>
              )}
            </div>
            <span className="hidden md:inline">Inbox</span>{" "}
          </span>
        </span>

        <a
          href="/privateUserProfile"
          className="ssu-nav-link group flex items-center"
        >
          <FontAwesomeIcon
            className="mr-4 text-lightMainText dark:text-darkMainText group-hover:text-white"
            icon={profileIcon}
          />
          <span className="hidden md:inline">Profile</span>{" "}
          {/* Text hidden on small screens */}
        </a>

        {/* Dark Mode Button */}
        <div className="mt-auto p-6 hidden md:block">
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
