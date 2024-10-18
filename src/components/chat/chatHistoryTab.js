import { useEffect, useState } from "react";
import getUserInfo from "../../utilities/decodeJwt";

const ChatHistoryTab = ({ chatRooms, handleRoomClick }) => {
  const [user, setUser] = useState(getUserInfo());
  const defaultProfileImageUrl =
    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <div>
      {chatRooms.length === 0 ? (
        <p className="text-center font-display mt-4 text-gray-800 dark:text-white">
          No messages yet
        </p>
      ) : (
        <div className="w-full h-full overflow-y-auto overflow-x-none">
          {chatRooms.map((room) => (
            <div
              key={room._id}
              className="flex p-2 border-b border-gray-300 font-title hover:bg-orange-500 cursor-pointer hover:text-white"
              onClick={() => handleRoomClick(room)}
            >
              <div className="flex ml-2 mr-2">
                <img
                  src={
                    room.participants.filter((p) => p.user._id !== user._id)[0]
                      .user.profileImage || defaultProfileImageUrl
                  }
                  alt="Profile Image"
                  className="h-9 w-9 rounded-full bg-white cursor-pointer mr-1 my-auto"
                />
              </div>
              <div className="flex-col w-full">
                <div className="flex-1 font-title font-bold mb-1">
                  @
                  {
                    room.participants.filter((p) => p.user._id !== user._id)[0]
                      .user.username
                  }
                </div>
                <div className="flex-1 font-display text-xs ml-1 text-gray-500 dark:text-gray-300">
                  {room.messages[room.messages.length - 1].text.slice(0, 40)}
                  {room.messages[room.messages.length - 1].text.length > 40
                    ? "..."
                    : ""}
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
