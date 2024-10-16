import React, { useState, useEffect } from "react";
import getUserInfo from "../../utilities/decodeJwt";

const ChatSearch = ({ searchInput }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchUsers, setSearchUsers] = useState([]);

  const fetchSearchUsers = () => {
    setSearchUsers([
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
    ]);
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
