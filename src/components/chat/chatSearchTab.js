import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatSearchTab = ({ currentUser, searchInput, handleChatUserClick }) => {
  const defaultProfileImageUrl =
    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";
  const [searchUsers, setSearchUsers] = useState([]);

  const fetchSearchUsers = async () => {
    if (!searchInput) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/search/${searchInput}`
      );
      const users = response.data;

      const result = users.filter(
        (user) => user.username !== currentUser.username
      );
      setSearchUsers(result);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  useEffect(() => {
    fetchSearchUsers();
  }, [searchInput]);

  return (
    currentUser && (
      <div className="w-full h-full overflow-y-auto overflow-x-none">
        {searchUsers.map((user) => (
          <div
            key={user._id}
            className="flex p-2 mt-1 font-title hover:bg-orange-500 cursor-pointer hover:text-white"
            onClick={() => handleChatUserClick(user)}
          >
            <div className="flex ml-2 mr-2">
              <img
                src={user.profileImage || defaultProfileImageUrl}
                alt="Profile Image"
                className="h-9 w-9 rounded-full bg-white cursor-pointer mr-2 my-auto"
              />
            </div>
            <div className="flex flex-col justify-center w-full">
              <span className="w-64 truncate overflow-hidden whitespace-nowrap">
                @{user.username}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default ChatSearchTab;
