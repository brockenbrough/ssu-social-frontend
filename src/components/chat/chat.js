import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage as chatIcon } from "@fortawesome/free-regular-svg-icons";
import getUserInfo from "../../utilities/decodeJwt";
import ChatSearchTab from "./chatSearchTab";
import ChatHistoryTab from "./chatHistoryTab";
import ChatTitleBar from "./chatTitleBar";
import ChatTab from "./chatTab";
import axios from "axios";
import apiClient from "../../utilities/apiClient";
import socket from "../../utilities/socket";

const Chat = () => {
  const TABS = { history: "history", search: "search", chat: "chat" };
  const [currentTab, setCurrentTab] = useState(TABS.history);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [user, setUser] = useState(getUserInfo());
  const [chatUser, setChatUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [currentChatRoom, setCurrentChatRoom] = useState({});
  const [chatRooms, setChatRooms] = useState([]);

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

  const fetchChatRooms = async () => {
    if (!user.id) {
      return;
    }

    try {
      const response = await apiClient.get(`/chatRoom/getByUserId/${user.id}`);
      const chatRooms = response.data.chatRooms;

      if (chatRooms) {
        setChatRooms(chatRooms);
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  const fetchMessages = async () => {
    if (!user.id) {
      return;
    }

    try {
      const response = await apiClient.get(`/message/getByUserId/${user.id}`);
      const messages = response.data.data;

      if (messages) {
        setMessages(messages);
      }
    } catch (error) {
      console.error("Error fetching unread message count:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchChatRooms();
    fetchMessages();

    const user = getUserInfo();

    socket.on("message", (data) => {
      if (data.receiverId === user.id || data.senderId === user.id) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("message");
    };
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

  const markMessagesAsRead = async (chatRoomId) => {
    const chatRoomUnreadMessages = messages
      .filter((m) => m.chatRoomId === chatRoomId)
      .map((m) => m._id);

    try {
      await apiClient.put("/message/markAsRead", {
        messageIds: chatRoomUnreadMessages,
      });

      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m.chatRoomId === chatRoomId ? { ...m, isRead: true } : m
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleChatRoomClick = async (chatRoom) => {
    const chatUserId = chatRoom.participants.filter(
      (p) => p.userId !== user._id
    )[0].userId;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUserById/${chatUserId}`
      );
      const chatUser = response.data;

      setChatUser(chatUser);
      setCurrentChatRoom(chatRoom);
      setCurrentTab(TABS.chat);
      markMessagesAsRead(chatRoom._id);
    } catch (error) {
      console.error("Error fetching chat user:", error);
    }
  };

  const handleChatUserClick = async (chatUser) => {
    let chatRoom = null;

    const data = {
      participants: [{ userId: user._id }, { userId: chatUser._id }],
    };

    try {
      const response = await apiClient.post("/chatRoom", data);

      chatRoom = response.data.chatRoom;
      const isChatRoomExists = chatRooms.some((chatRoom) =>
        chatRoom.participants.every((participant) =>
          data.participants.some((p) => p.userId === participant.userId)
        )
      );
      if (!isChatRoomExists) {
        setChatRooms([chatRoom, ...chatRooms]);
      }
      handleChatRoomClick(chatRoom);
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  const getUnreadMessages = () => {
    return messages.filter((m) => m.isRead === false);
  };

  const getLastMessages = () => {
    return chatRooms.map((chatRoom) => {
      const lastMessage = messages
        .filter((m) => m.chatRoomId === chatRoom._id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      return (
        lastMessage || { chatRoomId: chatRoom._id, text: null, date: null }
      );
    });
  };

  const getChatRoomMessages = (chatRoomId) => {
    const chatRoomMessages = messages.filter(
      (m) => m.chatRoomId === chatRoomId
    );
    chatRoomMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chatRoomMessages;
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
        {getUnreadMessages().length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getUnreadMessages().length}
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
          <div className="h-full pb-20">
            {/* Chat History Tab */}
            {currentTab === TABS.history && (
              <div className="h-full pb-1 overflow-y-auto">
                <ChatHistoryTab
                  user={user}
                  chatRooms={chatRooms}
                  lastMessages={getLastMessages()}
                  unreadMessages={getUnreadMessages()}
                  handleChatRoomClick={handleChatRoomClick}
                />
              </div>
            )}

            {/* Chat Tab */}
            {currentTab === TABS.chat && (
              <div className="h-full">
                <ChatTab
                  chatRoom={currentChatRoom}
                  chatRoomMessages={getChatRoomMessages(currentChatRoom._id)}
                  currentUser={user}
                  chatUser={chatUser}
                />
              </div>
            )}

            {/* Search Tab */}
            {currentTab === TABS.search && (
              <div className="h-full pb-1">
                <ChatSearchTab
                  currentUser={user}
                  searchInput={searchInput}
                  handleChatUserClick={handleChatUserClick}
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
