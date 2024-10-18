import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch as searchIcon } from "@fortawesome/free-solid-svg-icons";
import { faClose as closeIcon } from "@fortawesome/free-solid-svg-icons";
import { faEdit as createMessageIcon } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft as backIcon } from "@fortawesome/free-solid-svg-icons";
import getUserInfo from "../../utilities/decodeJwt";
import { useEffect, useState } from "react";

const ChatTitleBar = ({
  chatUser,
  currentTab,
  TABS,
  setSearchInput,
  handleSearchClose,
  handleSearchUser,
  handleChatBackClick,
  toogleChat,
}) => {
  const [user, setUser] = useState(getUserInfo());

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
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
      {currentTab === TABS.chat && (
        <div className="flex justify-start items-center p-3 border-b border-gray-500 dark:border-white font-title">
          {/* Back Button  */}
          <div className="flex justify-center">
            <FontAwesomeIcon
              onClick={handleChatBackClick}
              className="h-5 my-auto mr-5 text-gray-800 hover:text-orange-500 dark:text-white cursor-pointer"
              icon={backIcon}
            />
          </div>
          {/* Chat Username */}
          <a
            href={`/publicProfilePage/${chatUser.username}`}
            className="font-title font-bold text-lg no-underline text-gray-900 dark:text-white hover:text-orange-500"
          >
            @{chatUser.username}
          </a>
        </div>
      )}
      {/* Chat History Title Bar*/}
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
  );
};

export default ChatTitleBar;
