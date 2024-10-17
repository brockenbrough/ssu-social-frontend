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
  const [chatRooms, setChatRooms] = useState([]);
  const TABS = { history: "history", search: "search", chat: "chat" };
  const [currentTab, setCurrentTab] = useState(TABS.history);
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
    setCurrentTab(TABS.history);
  };

  const handleRoomClick = (room) => {
    console.log("Room clicked", room);
  };

  const handleUserClick = (user) => {
    // if chat room does not exist -> create chat room
    // open chat room
    if (!chatRooms.some((chatRoom) => chatRoom.user._id === user._id)) {
      setChatRooms([{ user }, ...chatRooms]);
    }
    setCurrentTab(TABS.history);
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
                  autoFocus={true}
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
            {currentTab === TABS.history && (
              <div className="flex justify-between items-center p-3 border-b border-gray-500 dark:border-white font-title">
                {/* Username */}
                <a
                  href={"/privateUserProfile"}
                  className="font-title font-bold text-lg no-underline text-gray-900 dark:text-white hover:text-orange-500"
                >
                  @{user.username}
                </a>
                <div className="flex justify-center">
                  {/* Create Chat  */}
                  <FontAwesomeIcon
                    onClick={handleSearchUser}
                    className="h-5 my-auto mr-5 text-gray-800 hover:text-orange-500 dark:text-white cursor-pointer"
                    icon={createMessageIcon}
                  />
                  {/* Search Chat  */}
                  <FontAwesomeIcon
                    onClick={handleSearchUser}
                    className="h-5 my-auto mr-5 text-gray-800 hover:text-orange-500 dark:text-white cursor-pointer"
                    icon={searchIcon}
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
            {currentTab === TABS.history &&
              (chatRooms.length === 0 ? (
                <p className="text-center font-display mt-4 text-gray-800 dark:text-white">
                  No messages yet
                </p>
              ) : (
                <div className="w-full h-full overflow-y-auto overflow-x-none">
                  {chatRooms.map((room) => (
                    <div
                      key={room.user._id}
                      className="flex flex-col p-2 border-b border-gray-300 font-title hover:bg-orange-500 cursor-pointer hover:text-white "
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="flex-1 font-title font-bold mb-1">
                        @{room.user.username}
                      </div>
                      <div className="flex-1 font-display text-xs">
                        @{room.user._id.slice(0, 20)}...
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* Search Tab */}
            {currentTab === TABS.search && (
              <div className="h-full pb-16">
                <ChatSearch
                  searchInput={searchInput}
                  handleUserClick={handleUserClick}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
