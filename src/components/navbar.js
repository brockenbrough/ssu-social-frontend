import React, { useEffect, useState } from "react";
import getUserInfo from "../utilities/decodeJwt";
import Image from "react-bootstrap/Image";
import { useDarkMode } from "../components/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox as inboxIcon } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus as createIcon } from "@fortawesome/free-solid-svg-icons";
import { faStar as forYouIcon } from "@fortawesome/free-solid-svg-icons";
import { faCompass as discoverIcon } from "@fortawesome/free-solid-svg-icons";
import { faUser as profileIcon } from "@fortawesome/free-solid-svg-icons";
import CreatePost from "./post/createPost";
import DarkModeButton from "./DarkModeButton";

export default function Navbar() {
  const [user, setUser] = useState(getUserInfo());
  const [popupShow, setPopupShow] = useState(false);
  const [inboxPopupShow, setInboxPopupShow] = useState(false);

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

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
          <div className="absolute left-40 top-40 w-64 bg-white rounded-md shadow-lg z-10">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <button
                onClick={() => setInboxPopupShow(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                &times; {/* close button */}
              </button>
            </div>
            <div className="p-2">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border-b last:border-b-0"
                >
                  <p className="text-sm text-gray-600">
                    Dummy Notification {index + 1}
                  </p>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() =>
                      console.log(`Close notification ${index + 1}`)
                    } // Close button action
                  >
                    &times; {/* close button */}
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
