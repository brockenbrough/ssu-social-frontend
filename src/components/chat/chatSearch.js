import React, { useState, useEffect } from "react";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";

const ChatSearch = ({ searchInput }) => {
  const [currentUser, setCurrentUser] = useState(null);
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
    setCurrentUser(getUserInfo());
    fetchSearchUsers();
  }, [searchInput]);

  return (
    currentUser && (
      <div className="w-full h-full overflow-y-scroll overflow-x-none">
        {searchUsers.map((user) => (
          <div className="flex p-3 border-b border-gray-300 font-title hover:bg-orange-500 cursor-pointer hover:text-white">
            <span>@{user.username}</span>
          </div>
        ))}
      </div>
    )
  );
};

export default ChatSearch;
