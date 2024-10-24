import { useEffect, useState } from "react";
import axios from "axios";
import timeAgo from "../../utilities/timeAgo";

const ChatHistoryTab = ({
  user,
  chatRooms,
  unreadMessages,
  handleChatRoomClick,
}) => {
  const defaultProfileImageUrl =
    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";
  const [chatRoomsWithUserInfo, setChatRoomsWithUserInfo] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);

  const getLastMessage = (chatRoomId) => {
    const lastMessage =
      "This is very long message that might take more space than expectedThis is very long message that might take more space than expectedThis is very long message that might take more space than expectedThis is very long message that might take more space than expectedThis is very long message that might take more space than expected";

    return { text: lastMessage, date: new Date() };
  };

  const getUnreadMessageCount = (chatRoomId) => {
    return unreadMessages.filter((m) => m.chatRoomId === chatRoomId).length;
  };

  const getChatUser = (chatRoom) => {
    return chatRoom.participants.filter((p) => p.userId !== user._id)[0].user;
  };

  const fetchChatRoomUsers = async () => {
    try {
      const userIds = [
        ...new Set(
          chatRooms.flatMap((room) => room.participants.map((p) => p.userId))
        ),
      ];

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUsersByIds`,
        { userIds }
      );

      const userMap = response.data.reduce((map, user) => {
        map[user._id] = user;
        return map;
      }, {});

      const newRooms = chatRooms.map((room) => {
        const updatedParticipants = room.participants.map((participant) => ({
          ...participant,
          user: userMap[participant.userId] || null,
        }));
        return { ...room, participants: updatedParticipants };
      });

      setChatRoomsWithUserInfo(newRooms);
    } catch (error) {
      console.error("Error fetching chat room users:", error);
    }
  };

  useEffect(() => {
    fetchChatRoomUsers();
  }, [chatRooms]);

  return (
    <div>
      {chatRoomsWithUserInfo.length === 0 ? (
        <p className="text-center font-display mt-4 text-gray-800 dark:text-white">
          No messages yet
        </p>
      ) : (
        <div className="w-full h-full overflow-y-auto overflow-x-none">
          {chatRoomsWithUserInfo.map((chatRoom) => (
            <div
              key={chatRoom._id}
              className="flex p-2 mt-1 font-title group hover:bg-orange-500 cursor-pointer hover:text-white"
              onClick={() => handleChatRoomClick(chatRoom)}
            >
              <div className="flex ml-2 w-60">
                <img
                  src={
                    getChatUser(chatRoom).profileImage || defaultProfileImageUrl
                  }
                  alt="Profile Image"
                  className="h-9 w-9 rounded-full bg-white cursor-pointer my-auto"
                />
              </div>
              <div className="flex-col w-full">
                <div className="flex-1 font-title font-bold mb-1 w-56 truncate overflow-hidden whitespace-nowrap">
                  @{getChatUser(chatRoom).username}
                </div>
                <div className="flex-1 font-display text-xs ml-1 text-gray-500 dark:text-gray-300 w-60 truncate overflow-hidden whitespace-nowrap">
                  {getLastMessage(chatRoom._id).text}
                </div>
              </div>
              <div className="flex-col w-full">
                <div
                  className={`flex-1 font-title text-xs w-16 truncate overflow-hidden whitespace-nowrap text-end ${
                    getUnreadMessageCount(chatRoom._id) > 0
                      ? "font-bold text-orange-500 group-hover:text-white"
                      : ""
                  }`}
                >
                  {timeAgo(getLastMessage(chatRoom._id).date)}
                </div>
                <div className="flex-1 font-display text-xs text-gray-500 dark:text-gray-300 truncate overflow-hidden whitespace-nowrap w-full text-end">
                  {getUnreadMessageCount(chatRoom._id) > 0 && (
                    <span className="chat-unread-chat-count">
                      {getUnreadMessageCount(chatRoom._id)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryTab;
