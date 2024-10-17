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
  const [user, setUser] = useState(getUserInfo());
  const [chatRooms, setChatRooms] = useState([
    {
      _id: "1",
      messages: [
        {
          _id: "10",
          senderUser: { _id: "1", username: "user1" },
          reciverUser: { _id: "2", username: "user2" },
          text: "Hello",
          date: "2021-10-10T10:00:00Z",
        },
        {
          _id: "11",
          senderUser: { _id: "2", username: "user2" },
          reciverUser: { _id: "1", username: "user1" },
          text: "last message placeholder  long very long very very long message",
          date: "2021-10-10T10:01:00Z",
        },
      ],
      participants: [
        {
          _id: "111",
          user: { _id: "1", username: "username_placeHolder" },
          firstMessageId: "11",
        },
        {
          _id: "112",
          user: { _id: "2", username: "user2" },
          firstMessageId: "10",
        },
      ],
    },
  ]);
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
    const roomExists = chatRooms.some((room) =>
      room.participants.some((participant) => participant.user._id === user._id)
    );
    if (!roomExists) {
      const newRooms = [
        {
          _id: `room-id-${chatRooms.length + 1}`,
          messages: [
            {
              _id: "10",
              senderUser: { _id: "1", username: "user1" },
              reciverUser: { _id: "2", username: "user2" },
              text: "Hello",
              date: "2021-10-10T10:00:00Z",
            },
            {
              _id: "11",
              senderUser: { _id: "2", username: "user2" },
              reciverUser: { _id: "1", username: "user1" },
              text: "What's up?",
              date: "2021-10-10T10:01:00Z",
            },
          ],
          participants: [
            {
              _id: "111",
              user: { _id: user._id, username: user.username },
              firstMessageId: "11",
            },
            {
              _id: "112",
              user: { _id: "2", username: "user2" },
              firstMessageId: "10",
            },
          ],
        },
        ...chatRooms,
      ];

      setChatRooms(newRooms);
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
                      key={room._id}
                      className="flex flex-col p-2 border-b border-gray-300 font-title hover:bg-orange-500 cursor-pointer hover:text-white "
                      onClick={() => handleRoomClick(room)}
                    >
                      <div className="flex-1 font-title font-bold mb-1">
                        @
                        {
                          room.participants.filter(
                            (p) => p.user._id !== user._id
                          )[0].user.username
                        }
                      </div>
                      <div className="flex-1 font-display text-xs ml-1 text-gray-500 dark:text-gray-300">
                        {room.messages[room.messages.length - 1].text.slice(
                          0,
                          40
                        )}
                        {room.messages[room.messages.length - 1].text.length >
                        40
                          ? "..."
                          : ""}
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
