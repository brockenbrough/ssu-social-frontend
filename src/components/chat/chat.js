import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage as chatIcon } from "@fortawesome/free-regular-svg-icons";
import getUserInfo from "../../utilities/decodeJwt";
import ChatSearchTab from "./chatSearchTab";
import ChatHistoryTab from "./chatHistoryTab";
import ChatTitleBar from "./chatTitleBar";
import ChatTab from "./chatTab";
import axios from "axios";

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [user, setUser] = useState(getUserInfo());
  const [chatUser, setChatUser] = useState({});
  const [unreadMessageCount, setUnreadMessageCount] = useState(10);
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
          user: {
            _id: "1",
            username: "username_placeHolder",
            profileImage:
              "https://ssusocial.s3.us-east-1.amazonaws.com/profilepictures/1729289675193_elephant.jpg",
          },
          firstMessageId: "11",
        },
        {
          _id: "112",
          user: {
            _id: "2",
            username: "user2",
            profileImage:
              "https://ssusocial.s3.us-east-1.amazonaws.com/profilepictures/1729289675193_elephant.jpg",
          },
          firstMessageId: "10",
        },
      ],
    },
  ]);
  const TABS = { history: "history", search: "search", chat: "chat" };
  const [currentTab, setCurrentTab] = useState(TABS.history);
  const [searchInput, setSearchInput] = useState("");

  const fetchUser = async () => {
    const tokenUser = getUserInfo();
    const username = tokenUser.username;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUserByUsername/${username}`
      );

      if (response.data) {
        setUser(response.data);
      } else {
        setUser(tokenUser);
      }
    } catch (error) {
      console.error("Error fetching User:", error);
      setUser(tokenUser);
    }
  };

  useEffect(() => {
    fetchUser();
    console.log("here", user);
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
            user: {
              _id: user._id,
              username: user.username,
              profileImage: user.profileImage,
            },
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

  return (
    <div className="fixed bottom-24 right-10">
      {/* Chat button */}
      <div
        onClick={handleChatClick}
        className="bg-orange-500 p-3 rounded-full flex justify-center cursor-pointer"
      >
        <FontAwesomeIcon className="z-10 h-7 text-white" icon={chatIcon} />
        {/* Unread message count */}
        {unreadMessageCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadMessageCount}
          </span>
        )}
      </div>

      {/* Chat pop up */}
      {chatOpen && (
        <div className="fixed bottom-44 right-10 w-96 h-[65vh] bg-lightBackground dark:bg-gray-900 border-1 border-gray-500 dark:border-white rounded-lg shadow-xl">
          {/* Titlebar */}
          <ChatTitleBar
            user={user}
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
                <ChatTab />
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
