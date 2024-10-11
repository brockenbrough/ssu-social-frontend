import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Image from "react-bootstrap/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox as inboxIcon } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus as createIcon } from "@fortawesome/free-solid-svg-icons";
import { faStar as forYouIcon } from "@fortawesome/free-solid-svg-icons";
import { faCompass as discoverIcon } from "@fortawesome/free-solid-svg-icons";
import { faUser as profileIcon } from "@fortawesome/free-solid-svg-icons";
import { faXmark as closeIcon } from "@fortawesome/free-solid-svg-icons";
import { faTrash as deleteIcon } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./post/createPost";
import DarkModeButton from "./DarkModeButton";

export default function Navbar() {
  const [user, setUser] = useState(getUserInfo());
  const [popupShow, setPopupShow] = useState(false);
  const [inboxPopupShow, setInboxPopupShow] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "follow",
      username: "elephant",
      actionUsername: "testtest",
      isRead: false,
      postId: null,
      date: "2024-10-11T00:13:24.241+00:00",
      text: "@testtest followed you",
    },
    {
      id: 2,
      type: "comment",
      username: "elephant",
      actionUsername: "testtest",
      isRead: true,
      postId: null,
      date: "2024-10-11T00:13:24.241+00:00",
      text: "@testtest commented on your post 'Hello World!'",
    },
    {
      id: 3,
      type: "follow",
      username: "elephant",
      actionUsername: "testtest",
      isRead: false,
      postId: null,
      date: "2024-10-11T00:13:24.241+00:00",
      text: "@testtest followed you",
    },
    {
      id: 4,
      type: "comment",
      username: "elephant",
      actionUsername: "testtest",
      isRead: false,
      postId: null,
      date: "2024-10-11T00:13:24.241+00:00",
      text: "@testtest commented on your post 'Hello World!'",
    },
    {
      id: 5,
      type: "comment",
      username: "elephant",
      actionUsername: "testtest",
      isRead: true,
      postId: null,
      date: "2024-10-11T00:13:24.241+00:00",
      text: "@testtest commented on your post 'Hello World!'",
    },
  ]);

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  const handleInboxClick = () => {
    setInboxPopupShow(!inboxPopupShow);
  };

  const handleDeleteNotification = (notification) => {
    setNotifications(notifications.filter((n) => n.id !== notification.id));
  };

  const handleNotificationClick = (notification) => {
    notification.isRead = true;
    setNotifications([...notifications]);
    // save in the backend
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

        {/* Create Post Button */}
        <span className="ssu-nav-link group" onClick={() => handleInboxClick()}>
          <span>
            <FontAwesomeIcon
              className="mr-3 text-orange-500 group-hover:text-white"
              icon={inboxIcon}
            />
            <span>Inbox</span>
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
      <div>
        {/* Notification Popup */}
        {inboxPopupShow && (
          <div className="fixed left-40 top-40 w-64 rounded-md shadow-lg z-10 bg-white ">
            <div className="flex justify-between items-center rounded-t-md p-3 bg-orange-500">
              <h3 className="text-white font-title">Notifications</h3>
              <button
                onClick={() => setInboxPopupShow(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon
                  className="text-white text-2xl"
                  icon={closeIcon}
                />
              </button>
            </div>
            <div className="p-1 rounded-b-md dark:bg-gray-800 dark:rounded-none h-56 overflow-y-scroll">
              {notifications.length === 0 && (
                <p className="text-sm my-4 text-center min-h-6 font-display text-gray-800 dark:text-white">
                  No notifications
                </p>
              )}
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex justify-between items-center p-2 border-b last:border-b-0 group cursor-pointer"
                >
                  <span
                    className="w-full"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.isRead ? (
                      <p className="text-xs my-1 min-h-6 font-display text-gray-800 dark:text-white">
                        {notification.text}
                      </p>
                    ) : (
                      <p className="text-xs font-bold my-1 min-h-6 font-display text-gray-800 dark:text-white">
                        {notification.text}
                      </p>
                    )}
                  </span>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => handleDeleteNotification(notification)}
                  >
                    <FontAwesomeIcon
                      className="text-transparent group-hover:text-orange-500"
                      icon={deleteIcon}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
