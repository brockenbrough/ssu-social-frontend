import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage as chatIcon } from "@fortawesome/free-solid-svg-icons";
import { faClose as closeIcon } from "@fortawesome/free-solid-svg-icons";
import getUserInfo from "../../utilities/decodeJwt";

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const toogleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleChatClick = () => {
    toogleChat();
    console.log("Chat button clicked");
  };

  return (
    <div className="fixed bottom-24 right-10">
      {/* Chat button */}
      <FontAwesomeIcon
        onClick={handleChatClick}
        className="z-10 h-10 text-orange-500 hover:text-orange-600 cursor-pointer"
        icon={chatIcon}
      />

      {/* Chat pop up */}
      {chatOpen && (
        <div className="fixed bottom-40 right-10 w-96 h-[600px] bg-lightBackground dark:bg-gray-900 border rounded-lg shadow-xl">
          {/* Titlebar */}
          <div className="flex justify-between items-center p-3 border-b border-gray-300 font-title">
            <a
              href={"/privateUserProfile"}
              className="font-title font-bold text-lg no-underline text-gray-900 dark:text-white hover:text-orange-500"
            >
              @{user.username}
            </a>
            <FontAwesomeIcon
              onClick={toogleChat}
              className="h-6 text-gray-800 hover:text-orange-500 dark:text-white cursor-pointer"
              icon={closeIcon}
            />
          </div>
          <div className="p-2">Chat content</div>
        </div>
      )}
    </div>
  );
};

export default Chat;
