import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane as sendIcon } from "@fortawesome/free-solid-svg-icons";

let scrollEffect = "smooth";

const ChatTab = ({ chatRoom }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = (effect) => {
    messagesEndRef.current?.scrollIntoView({ behavior: effect });
  };

  const fetchMessages = () => {
    setMessages(chatRoom.messages);
  };

  useEffect(() => {
    scrollEffect = "instant";
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom(scrollEffect);
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    setMessages([
      ...messages,
      { id: messages.length + 1, text: newMessage, sender: "user1" },
    ]);
    setNewMessage("");
    scrollEffect = "smooth";
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
                      <span className="inline-block" style={{ width: "2ch" }} />
                    )}{" "}
                  </span>
                ))}
                <br />
              </span>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-2 pt-2 pb-3 flex items-center">
        <textarea
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg outline-none font-display w-30 text-gray-900 dark:text-white bg-transparent h-12"
          autoFocus={true}
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
  );
};

export default ChatTab;
