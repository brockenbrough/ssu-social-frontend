import React, { useState, useEffect, createElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage as chatIcon } from "@fortawesome/free-regular-svg-icons";
import { faSearch as searchIcon } from "@fortawesome/free-solid-svg-icons";
import { faClose as closeIcon } from "@fortawesome/free-solid-svg-icons";
import { faEdit as createMessageIcon } from "@fortawesome/free-solid-svg-icons";
import getUserInfo from "../../utilities/decodeJwt";
import ChatSearch from "./chatSearch";

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const TABS = { chat: "chat", search: "search", create: "create" };
  const [currentTab, setCurrentTab] = useState(TABS.chat);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  const toogleChat = () => {
    setChatOpen(!chatOpen);
  };

  const handleChatClick = () => {
    toogleChat();
  };

  const handleSearchUser = () => {
    setCurrentTab(TABS.search);
  };

  const handleSearchClose = () => {
    setCurrentTab(TABS.chat);
  };

  const handleCreateMessage = () => {
    console.log("Create Chat button clicked");
  };

  return (
    <div className="fixed bottom-24 right-10">
      {/* Chat button */}
      <div
        onClick={handleChatClick}
        className="bg-orange-500 p-3 rounded-full flex justify-center cursor-pointer"
      >
        <FontAwesomeIcon className="z-10 h-7 text-white" icon={chatIcon} />
      </div>

      {/* Chat pop up */}
      {chatOpen && (
        <div className="fixed bottom-44 right-10 w-96 h-[600px] bg-lightBackground dark:bg-gray-900 border-1 border-gray-500 dark:border-white rounded-lg shadow-xl">
          {/* Titlebar */}
          <div>
            {/* Search Tab Title Bar*/}
            {currentTab === TABS.search && (
              <div className="flex justify-between items-center py-1 border-b border-gray-500 dark:border-white font-title">
                <input
                  className="bg-transparent border-1 px-2 rounded font-title w-full h-10 ml-3 border-gray-500 dark:border-white"
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search"
                />
                {/* Close Search pop up  */}
                <FontAwesomeIcon
                  onClick={handleSearchClose}
                  className="h-6 p-3 text-gray-800 hover:text-orange-500 dark:text-white cursor-pointer"
                  icon={closeIcon}
                />
              </div>
            )}
            {/* Chat Tab Title Bar*/}
            {currentTab === TABS.chat && (
              <div className="flex justify-between items-center p-3 border-b border-gray-500 dark:border-white font-title">
                {/* Username */}
                <a
                  href={"/privateUserProfile"}
                  className="font-title font-bold text-lg no-underline text-gray-900 dark:text-white hover:text-orange-500"
                >
                  @{user.username}
                </a>
                <div className="flex justify-center">
                  {/* Search User  */}
                  <FontAwesomeIcon
                    onClick={handleSearchUser}
                    className="h-5 my-auto mr-5 text-gray-800 hover:text-orange-500 dark:text-white cursor-pointer"
                    icon={searchIcon}
                  />
                  {/* Create Chat  */}
                  <FontAwesomeIcon
                    onClick={handleCreateMessage}
                    className="h-5 my-auto mr-5 text-gray-800 hover:text-orange-500 dark:text-white cursor-pointer"
                    icon={createMessageIcon}
                  />
                  {/* Close Chat pop up  */}
                  <FontAwesomeIcon
                    onClick={toogleChat}
                    className="h-6 text-gray-800 hover:text-orange-500 dark:text-white cursor-pointer"
                    icon={closeIcon}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="h-full">
            {/* Chat Tab */}
            {currentTab === TABS.chat && chatHistory.length === 0 && (
              <p className="text-center font-display mt-4 text-gray-800 dark:text-white">
                No messages yet
              </p>
            )}

            {/* Search Tab */}
            {currentTab === TABS.search && (
              <div className="h-full pb-16">
                <ChatSearch searchInput={searchInput} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
