import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell as notificationIcon } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus as createIcon } from "@fortawesome/free-solid-svg-icons";
import { faStar as forYouIcon } from "@fortawesome/free-solid-svg-icons";
import { faCompass as discoverIcon } from "@fortawesome/free-solid-svg-icons";
import { faUser as profileIcon } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass as searchButton } from "@fortawesome/free-solid-svg-icons";
import { faMoon as moonIcon, faSun as sunIcon } from "@fortawesome/free-solid-svg-icons"; // Added sun and moon icons for dark mode
import apiClient from "./../utilities/apiClient";
import CreatePost from "./post/createPost";
import DarkModeButton from "./DarkModeButton";
import Notification from "./notification/Notification";
import { useNavigate, Link } from "react-router-dom";
import { useHoverButton } from "./useHoverButton";

export default function Navbar() {
	const [user, setUser] = useState(getUserInfo());
  const [userId, setUserId] = useState(getUserInfo()?.id);
	const [popupShow, setPopupShow] = useState(false);
	const [inboxPopupShow, setInboxPopupShow] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark')); // Track dark mode state
	const navigate = useNavigate();
	const hoverRef = useHoverButton();

	useEffect(() => {
		const userInfo = getUserInfo();
    const userId = userInfo.id;
		if (userInfo) {
			fetchNotifications(userInfo.username);
		}
    setUserId(userInfo.id);
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

	const handleSearchClick = (event) => {
		event.preventDefault();
		navigate("/searchPage", { state: { searchInput: "" } });
	};

  const handleSmartClick = (e) => {
    e.preventDefault();
    if (userId) {
      navigate(`/smartPostSearch/${userId}`);
    } else {
      console.error("User ID is not available.");
    }
  };


	// Don't render Navbar if user is not defined
	if (!user) {
		return null;
	}

	// Toggle Dark Mode and update the state
	const toggleDarkMode = () => {
		document.documentElement.classList.toggle('dark');
		setIsDarkMode(!isDarkMode); // Update the dark mode state
	};

return (
  <>
    <div className="pt-6 sidebar-navbar sm:w-18 md:w-18 lg:w-34">
      <div className="hidden logo-container md:flex">
        <Link to="/feed-algorithm">
          <img
            ref={hoverRef}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPnHm79GDZXZjpifapjAOWRsJcA_C3FgxWQLlbto&s"
            alt="SSUSocial Logo"
            className="ssu-nav-logo"
          />
        </Link>
      </div>
      <div className="hidden mt-2 mb-5 text-center md:block">
        <Link to="/feed-algorithm" className="ssu-social-word">
          SSUSocial
        </Link>
      </div>

      {/* Create Post Button */}
      <span
        className="flex items-center justify-start ssu-nav-link group"
        onClick={() => setPopupShow(true)}
      >
        <FontAwesomeIcon
          className="mr-4 fa-plus-circle text-lightMainText dark:text-darkMainText group-hover:text-white"
          icon={createIcon}
        />
        <span className="hidden md:inline">Create Post</span>
      </span>
      <CreatePost popupShow={popupShow} setPopupShow={setPopupShow} />
      
      {/* Direct Links Instead of Dropdown */}
      <a
        href="/searchPage"
        onClick={handleSearchClick}
        className="flex items-center justify-start ssu-nav-link group"
      >
        <FontAwesomeIcon
          className="mr-4 text-lightMainText dark:text-darkMainText group-hover:text-white rotate-in-circle"
          icon={searchButton}
        />
        <span className="hidden md:inline">Search</span>
      </a>

      <a
          href={`/smartPostSearch/${userId}`}
          onClick={handleSmartClick}
          className="flex items-center justify-start ssu-nav-link group"
        >
          <FontAwesomeIcon
            className="mr-4 text-lightMainText dark:text-darkMainText group-hover:text-white rotate-in-circle"
            icon={searchButton}
          />
          <span className="hidden md:inline">SmartSearch</span>
        </a>

      <a
        href="/feed-algorithm"
        className="flex items-center ssu-nav-link group"
      >
        <FontAwesomeIcon
          className="mr-4 shoot-icon text-lightMainText dark:text-darkMainText group-hover:text-white"
          icon={forYouIcon}
        />
        <span className="hidden md:inline">For You</span>
      </a>
      <a href="/getallpost" className="flex items-center ssu-nav-link group">
        <FontAwesomeIcon
          className="mr-4 spin-icon text-lightMainText dark:text-darkMainText group-hover:text-white"
          icon={discoverIcon}
        />
        <span className="hidden md:inline">Discover</span>
      </a>

      {/* Create Inbox Button */}
      <span
        className="flex items-center ssu-nav-link group shake-on-hover"
        onClick={() => handleInboxClick()}
      >
        <span className="flex items-center">
          <div className="relative mr-1">
            <FontAwesomeIcon
              className="mr-3 bell text-lightMainText dark:text-darkMainText group-hover:text-white"
              icon={notificationIcon}
            />
            {/* Notification count */}
            {notifications.filter((n) => n.isRead === false).length > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-normal text-white bg-red-600 rounded-full -top-2 -right-0">
                {notifications.filter((n) => n.isRead === false).length}
              </span>
            )}
          </div>
          <span className="hidden md:inline">Notifications</span>
        </span>
      </span>
      <a
        href="/privateUserProfile"
        className="flex items-center ssu-nav-link group bounce-on-hover"
      >
        <FontAwesomeIcon
          className="mr-4 text-lightMainText dark:text-darkMainText group-hover:text-white icon"
          icon={profileIcon}
        />
        <span className="hidden md:inline">Profile</span>
      </a>

      {/* Dark Mode Button (Full Button for Larger Screens) */}
      <div className="hidden p-6 mt-auto md:block">
        <DarkModeButton />
      </div>

      {/* Dark Mode Icon for Collapsed Window (Smaller Screens) */}
      <div className="justify-center block center md:hidden">
        {/* Icon Button for Dark Mode on small screens */}
        <button onClick={toggleDarkMode}>
          <FontAwesomeIcon
            icon={isDarkMode ? sunIcon : moonIcon} // Switch between sun and moon
            className="text-lightMainText dark:text-darkMainText group-hover:text-white"
          />
        </button>
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