import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage as chatIcon } from "@fortawesome/free-regular-svg-icons";
import { faPaperPlane as sendIcon } from "@fortawesome/free-solid-svg-icons";
import getUserInfo from "../../utilities/decodeJwt";
import ChatSearchTab from "./chatSearchTab";
import ChatHistoryTab from "./chatHistoryTab";
import ChatTitleBar from "./chatTitleBar";

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUser] = useState(getUserInfo());
  const [chatUser, setChatUser] = useState({});
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

  const handleChatBackClick = () => {
    setCurrentTab(TABS.history);
  };

  const handleRoomClick = (room) => {
    const chatUser = room.participants.filter((p) => p.user._id !== user._id)[0]
      .user;
    setChatUser(chatUser);
    setCurrentTab(TABS.chat);
  };

  const handleUserClick = (user) => {
    let room = chatRooms.find((room) =>
      room.participants.some((participant) => participant.user._id === user._id)
    );

    if (!room) {
      room = {
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
      };

      setChatRooms([room, ...chatRooms]);
    }

    handleRoomClick(room);
  };

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "user1" },
    { id: 2, text: "Hi there!", sender: "user2" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Add the new message to the list
    setMessages([
      ...messages,
      { id: messages.length + 1, text: newMessage, sender: "user1" },
    ]);
    setNewMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      setNewMessage(newMessage + "\t");
    }
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
        <div className="fixed bottom-44 right-10 w-96 h-[65vh] bg-lightBackground dark:bg-gray-900 border-1 border-gray-500 dark:border-white rounded-lg shadow-xl">
          {/* Titlebar */}
          <ChatTitleBar
            chatUser={chatUser}
            TABS={TABS}
            currentTab={currentTab}
            handleSearchClose={handleSearchClose}
            handleSearchUser={handleSearchUser}
            handleChatBackClick={handleChatBackClick}
            setSearchInput={setSearchInput}
            toogleChat={toogleChat}
          />
          {/* Tab Body */}
          <div className="h-full pb-16">
            {/* Chat History Tab */}
            {currentTab === TABS.history && (
              <ChatHistoryTab
                chatRooms={chatRooms}
                handleRoomClick={handleRoomClick}
              />
            )}

            {/* Chat Tab */}
            {currentTab === TABS.chat && (
              <div className="h-full">
                <div className="h-full flex flex-col">
                  {/* Chat Window */}
                  <div className="flex-1 overflow-y-auto p-3 bg-lightBackground dark:bg-gray-900 space-y-2">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-2 font-display text-sm rounded-lg break-words ${
                          message.sender === "user1"
                            ? "bg-orange-500 text-white self-end ml-40"
                            : "bg-gray-300 text-gray-900 self-start mr-40"
                        }`}
                      >
                        {message.text.split("\n").map((line, lineIndex) => (
                          <span key={lineIndex}>
                            {line.split("\t").map((tabbedText, tabIndex) => (
                              <span key={tabIndex}>
                                {tabbedText}
                                {tabIndex < line.split("\t").length - 1 && (
                                  <span
                                    className="inline-block"
                                    style={{ width: "2ch" }}
                                  />
                                )}{" "}
                              </span>
                            ))}
                            <br />
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-2 flex items-center">
                    <textarea
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-lg outline-none font-display w-30 text-gray-900 dark:text-white bg-transparent h-12"
                      autoFocus="true"
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="ml-2 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-menu"
                    >
                      <FontAwesomeIcon
                        className="text-white-500 text-2xl"
                        icon={sendIcon}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Tab */}
            {currentTab === TABS.search && (
              <div className="h-full pb-1">
                <ChatSearchTab
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
