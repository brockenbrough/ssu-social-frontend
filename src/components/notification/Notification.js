import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark as closeIcon } from "@fortawesome/free-solid-svg-icons";
import { faTrash as deleteIcon } from "@fortawesome/free-solid-svg-icons";

export default function Notification({
  notifications,
  setNotifications,
  handleHideNotificationPopup,
}) {
  const [filter, setFilter] = useState("like");
  const [activeFilterTab, setActiveFilterTab] = useState("like");
  const toggleFilter = (type) => {
    setFilter(type);
    setActiveFilterTab(type);
  };
  const [likeNotifications, setLikeNotifications] = useState([]);
  const [commentNotifications, setCommentNotifications] = useState([]);
  const [followNotifications, setFollowNotifications] = useState([]);
  const filteredNotifications = filter
    ? notifications.filter((notification) => notification.type === filter)
    : notifications;

  useEffect(() => {
    updateNotifications(notifications);
  }, [notifications]);

  const updateNotifications = (notifications) => {
    setNotifications(notifications);

    const likeNotifications = notifications.filter((n) => n.type === "like");
    const commentNotifications = notifications.filter(
      (n) => n.type === "comment"
    );
    const followNotifications = notifications.filter(
      (n) => n.type === "follow"
    );

    setLikeNotifications(likeNotifications);
    setCommentNotifications(commentNotifications);
    setFollowNotifications(followNotifications);
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

  const scrollToPost = (postId) => {
    if (postId) {
      let postElement = null;

      const checkAndScroll = () => {
        postElement = document.getElementById(`post-${postId}`);

        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (
          window.innerHeight + window.scrollY <
          document.body.scrollHeight
        ) {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });

          setTimeout(checkAndScroll, 1000);
        }

        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      checkAndScroll();
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      notification.isRead = true;
      updateNotifications([...notifications]);
      markNotificationAsRead(notification);
    }

    scrollToPost(notification.postId);
  };

  const handleDeleteNotification = (notification) => {
    const updatedNotifications = notifications.filter(
      (n) => n._id !== notification._id
    );
    updateNotifications(updatedNotifications);
    deleteNotification(notification);
  };

  return (
    <div className="fixed left-40 top-40 w-80 rounded-md shadow-lg z-10 bg-white ">
      {/* Notification title */}
      <div className="flex justify-between items-center rounded-t-md p-3 bg-orange-500">
        <h3 className="text-white font-title">Notifications</h3>
        <button
          onClick={() => handleHideNotificationPopup()}
          className="text-gray-600 hover:text-gray-800"
        >
          <FontAwesomeIcon className="text-white text-2xl" icon={closeIcon} />
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
            <div className="flex justify-around p-2 ">
              <button
                onClick={() => toggleFilter("like")}
                className={`${
                  activeFilterTab === "like"
                    ? "ssu-nav-filter-btn-selected mr-2"
                    : "ssu-nav-filter-btn mr-2"
                }`}
              >
                Likes
                {likeNotifications.length > 0 && (
                  <span className="ssu-nav-filter-count">
                    {likeNotifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("comment")}
                className={`${
                  activeFilterTab === "comment"
                    ? "ssu-nav-filter-btn-selected mr-2"
                    : "ssu-nav-filter-btn mr-2"
                }`}
              >
                Comments
                {commentNotifications.length > 0 && (
                  <span className="ssu-nav-filter-count">
                    {commentNotifications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => toggleFilter("follow")}
                className={`${
                  activeFilterTab === "follow"
                    ? "ssu-nav-filter-btn-selected"
                    : "ssu-nav-filter-btn"
                }`}
              >
                Follows
                {followNotifications.length > 0 && (
                  <span className="ssu-nav-filter-count">
                    {followNotifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Filtered Notification list */}
            {filteredNotifications.length === 0 ? (
              <p className="text-sm my-4 text-center min-h-6 font-display text-gray-800 dark:text-white">
                {filter === "like" && "No Likes Notifications"}
                {filter === "comment" && "No Comments Notifications"}
                {filter === "follow" && "No Follows Notifications"}
              </p>
            ) : (
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
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
