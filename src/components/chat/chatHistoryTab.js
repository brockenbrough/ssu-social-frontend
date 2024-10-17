import { useEffect, useState } from "react";
import getUserInfo from "../../utilities/decodeJwt";

const ChatHistoryTab = ({ chatRooms, handleRoomClick }) => {
  const [user, setUser] = useState(getUserInfo());

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <div>
      {/* Chat Tab */}
      {chatRooms.length === 0 ? (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryTab;
