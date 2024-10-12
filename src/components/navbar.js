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
import { faXmark as closeIcon } from "@fortawesome/free-solid-svg-icons";
import { faTrash as deleteIcon } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./post/createPost";
import DarkModeButton from "./DarkModeButton";

export default function Navbar() {
  const [user, setUser] = useState(getUserInfo());
  const [popupShow, setPopupShow] = useState(false);
  const [inboxPopupShow, setInboxPopupShow] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState(null); // Initialize filter state


  // Filter nossu-text-titlesmall
  const filteredNotifications = filter
  ? notifications.filter(notification => notification.type === filter)
  : notifications;

  const toggleFilter = (type) => {
    setFilter(prevFilter => prevFilter === type ? null : type);
  };


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

  const deleteNotification = async (notification) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/notification/deleteById/${notification._id}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markNotificationAsRead = async (notification) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/notification`,
        {
          id: notification._id,
          isRead: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleInboxClick = () => {
    setInboxPopupShow(!inboxPopupShow);
  };

  const handleDeleteNotification = (notification) => {
    setNotifications(notifications.filter((n) => n._id !== notification._id));
    deleteNotification(notification);
  };

  const handleNotificationClick = (notification) => {
    if (notification.isRead) return;

    notification.isRead = true;
    setNotifications([...notifications]);
    markNotificationAsRead(notification);
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

            {/* Notification body */}
            <div className="p-1 rounded-b-md dark:bg-gray-800 dark:rounded-none h-56 overflow-y-scroll">
              {/* Show "No notifications" if empty */}
              {notifications.length === 0 ? (
                <p className="text-sm my-4 text-center min-h-6 font-display text-gray-800 dark:text-white">
                  No notifications
                </p>
              ) : (
                <>
                  {/* Filter buttons (Likes, Comments, Follows) */}
                  <div className="flex justify-around p-2 bg-gray-100 dark:bg-gray-700">
                    <button onClick={() => toggleFilter('like')} className="ssu-button-info-clickable">
                      Likes
                    </button>
                    <button onClick={() => toggleFilter('comment')} className="ssu-button-info-clickable">
                      Comments
                    </button>
                    <button onClick={() => toggleFilter('follow')} className="ssu-button-info-clickable">
                      Follows
                    </button>
                  </div>

                  {/* Filtered Notification list */}
                  {filteredNotifications.length === 0 ? (
                  <p className="text-sm my-4 text-center min-h-6 font-display text-gray-800 dark:text-white">
                    {filter === 'like' && 'No likes found'}
                    {filter === 'comment' && 'No comments found'}
                    {filter === 'follow' && 'No follows found'}
                  </p>
                ) : 
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification._id}
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
