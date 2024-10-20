import React, {
  useState,
  useEffect,
  useLayoutEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import apiClient from "../../utilities/apiClient";
import { Link } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import Stack from "react-bootstrap/Stack";
import timeAgo from "../../utilities/timeAgo";
import { deleteComment } from './deleteComment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane as sendIcon } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { fetchProfileImage } from "../../components/post/fetchProfileImage";

const CommentCountContext = createContext();

export function CommentCountProvider({ children }) {
  const [commentCount, setCommentCount] = useState(0);

  return (
    <CommentCountContext.Provider value={{ commentCount, setCommentCount }}>
      {children}
    </CommentCountContext.Provider>
  );
}

const truncateUsername = (username = "", timeAgoString = "", maxLineLength = 26) => {
  const totalCharLengthOfLine = username.length + 1 + timeAgoString.length; // +1 for '@' symbol

  if (totalCharLengthOfLine > maxLineLength) {
    // Subtract 1 for '@' symbol and timeAgo length
    const allowedUsernameLength = maxLineLength - 1 - timeAgoString.length;
    //Truncate and add ..
    return username.slice(0, allowedUsernameLength) + "..";
  }

  return username;
};

export function useCommentCount() {
  return useContext(CommentCountContext);
}

function CreateComment({ post, setParentCommentCount, postCardHeight }) {
  const navigate = useNavigate();
  const postId = post._id;
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const commentsEndRef = useRef(null);
  const textareaRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formData, setFormData] = useState({
    commentContent: "",
  });
  const [emojiSuggestions, setEmojiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const defaultProfileImageUrl = "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";
  const [profileImages, setProfileImages] = useState({});

  useEffect(() => {
    if (comments.length > 0) {
      comments.forEach(async (comment) => {
        const imageUrl = await fetchProfileImage(comment.username);
        setProfileImages((prevImages) => ({
          ...prevImages,
          [comment.username]: imageUrl,
        }));
      });
    }
  }, [comments]);

  const findEmojiSuggestions = (input) => {
    const emojis = Object.values(data.emojis);
    const regex = new RegExp(`^${input}`, "i");
    return emojis.filter((emoji) => emoji.id.match(regex));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomEmoji(getRandomEmoji());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.style.height = `${postCardHeight - 132}px`;
    }
  }, [postCardHeight, comments]);

  const scrollToBottom = () => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollTop = commentsEndRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  useEffect(() => {
    // Use the useEffect hook to run code after the component has rendered.
    const currentUser = getUserInfo(); // Decode the JWT token to get user info.
    setUser(currentUser); // Set the user state with the decoded user info.

    // Fetch the comment count for the specific post
    fetchCommentCount();
  }, [postId]);

  // This method fetches the records from the database.
  // Hook useEffect - this hook is used to invoke something after rendering.
  useEffect(() => {
    // Define a function to get records. We are going to call it below.
    // We use async keyword so we can ．０later say "await" to block on finish.
    async function getRecords() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/getCommentById/${postId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      if (response != null) {
        const fetchedRecords = await response.json();
        setComments(fetchedRecords); // update state.  when state changes, we automatically re-render.
      }
    }
    getRecords(); // Now that we defined it, call the function.
  }, [postId]);

  const fetchCommentCount = () => {
    // Fetch the comment count using a similar fetch request as in your Post component
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/count/comments-for-post/${postId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCommentCount(data); // Update the comment count
      })
      .catch((error) => {
        console.error("Error fetching comment count:", error);
      });
  };

  const fetchComments = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/getCommentById/${postId}`,
      { method: "GET" }
    );

    if (response.ok) {
      const fetchedRecords = await response.json();
      setComments(fetchedRecords);
    } else {
      console.error("Error fetching comments:", response.statusText);
    }
  };

  const findEmojiByShortcode = (shortcode) => {
    const emojis = Object.values(data.emojis);

    for (const emoji of emojis) {
      if (emoji.id === shortcode) {
        return emoji.skins[0].native;
      }
    }
  };

  //Take Id to get short coded emoji "ex: ./grin"
  const handleEmojiReplacement = (content) => {
    const emojiShortcutRegex = /(\.\/\w+)/g;

    return content.replace(emojiShortcutRegex, (match) => {
      const shortcode = match.slice(2);
      const emoji = findEmojiByShortcode(shortcode);

      return emoji || match;
    });
  };

  //Random emoji for mostly face expressions
  const getRandomEmoji = () => {
    const faceEmojis = Object.values(data.emojis).filter(
      (emoji) =>
        emoji.keywords &&
        emoji.keywords.some((keyword) =>
          [
            "face",
            "smile",
            "happy",
            "sad",
            "angry",
            "expression",
            "dog",
          ].includes(keyword)
        )
    );

    const randomIndex = Math.floor(Math.random() * faceEmojis.length);
    return faceEmojis[randomIndex].skins[0].native;
  };

  const [randomEmoji, setRandomEmoji] = useState(getRandomEmoji());

  // Once an emoji is clicked its added to the textarea
  const handleEmojiClick = (emojiObject) => {
    const emoji = emojiObject.native;
    const newContentLength = formData.commentContent.length + emoji.length;

    if (newContentLength <= 255) {
      setFormData((prevState) => ({
        ...prevState,
        commentContent: prevState.commentContent + emoji,
      }));
      setShowEmojiPicker(false);
    }
  };

  // Emoji Box listener to close the box after clicked outside of the box
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the emoji picker, emoji button, and textarea
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target) // Don't close if textarea is clicked
      ) {
        setShowEmojiPicker(false); // Close emoji picker
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const saveCommentNotification = async (post) => {
    const data = {
      type: "comment",
      username: post.username,
      actionUsername: user.username,
      text: `@${user.username} commented on your post: ${post.content.slice(
        0,
        20
      )}${post.content.length > 20 ? "..." : "."}`,
      postId: post._id,
    };

    if (data.username === data.actionUsername) return;

    try {
      await apiClient.post(`/notification`, data);
    } catch (error) {
      console.error("Error saving comment notification:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentCount(commentCount + 1);
    setParentCommentCount(commentCount + 1);

    const userId = user.id;
    const username = user.username;
    const { commentContent } = formData;
    const submissionDate = new Date();

    // Create a new comment object
    const newComment = {
      postId,
      userId,
      username,
      commentContent,
      submissionDate,
    };

    try {
      // Send a POST request to create the comment in MongoDB
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        }
      );

      if (response.ok) {
        // Reset Form
        setFormData({ commentContent: "" });
        setShowEmojiPicker(false);

        // Update comments
        setComments([...comments, newComment]);

        // Fetch comment count and comments
        fetchCommentCount();
        fetchComments();
        saveCommentNotification(post);
        setParentCommentCount();
      } else {
        // Handle errors if needed
        console.error("Error:", response.status);
        // Handle the error and provide user feedback
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle any other errors that may occur during the fetch request
      // Provide user feedback as needed
    }
  };

  function commentList() {
    if (comments === null || comments.length === 0) {
      return (
        <input
          type="text"
          placeholder="Be the First to Comment ..."
          disabled
          className="comment-input-blank"
        />
      );
    }
    return comments.map((comment) => {
      const timeAgoString = timeAgo(comment.date);
      const truncatedUsername = truncateUsername(comment.username, timeAgoString);

      return (
        //Spacing Between Comments is "mb-2", Comment Border is set to none
        <div className="w-full custom-comment-card mx-0 mb-2 relative">
          <Stack style={{ border: "none" }}>
            <div className="flex space-x-1 items-start">
              {/* Profile Image */}
              <img
                src={profileImages[comment.username] || defaultProfileImageUrl}
                alt="Profile"
                className="w-7 h-7 rounded-full ml-[-2] mr-1 bg-white cursor-pointer"
                onClick={() => {
                  navigate(
                    user.username === comment.username
                      ? "/privateUserProfile"
                      : `/publicProfilePage/${comment.username}`
                  );
                }}
              />
              <div className="flex flex-col w-full">
                <div className="flex items-center">
                  <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
                    <Link
                      id="username"
                      to={
                        user.username === comment.username
                          ? "/privateUserProfile"
                          : `/publicProfilePage/${comment.username}`
                      }
                      className="ssu-comment-username"
                    >
                      @{truncatedUsername}
                    </Link>
                  </span>
                  <span className="ssu-comment-timeago">
                    {timeAgoString}
                  </span>
                </div>
                <span className="ssu-comment-content w-full break-words overflow-hidden text-ellipsis whitespace-pre-wrap">
                  {comment.commentContent}
                </span>
              </div>
            </div>
            {user.username === comment.username && (
              <button
                className="custom-delete-button absolute right-0 top-2"
                onClick={async () => {
                  const success = await deleteComment(comment._id);
                  if (success) {
                    setComments(comments.filter((el) => el._id !== comment._id));
                    setParentCommentCount();
                  }
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="text-base" />
              </button>
            )}
          </Stack>
        </div>
      );
    });
  }

  return (
    <div className="container mt-0">
      <div>
        <span>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginRight: "12px",
              marginTop: "0px",
            }}
          >
            Comments
          </span>
          <span style={{ fontSize: "1.2rem" }}>{comments.length}</span>
        </span>
      </div>

      {/* Scrollable Comment section Div */}
      <div
        ref={commentsEndRef}
        className="custom-scrollbar custom-scrollbar-dark mx-0"
        style={{
          overflowY: "auto",
          marginTop: "15px",
          paddingBottom: "0px",
          paddingRight: "13px",
          borderRadius: "5px",
        }}
      >
        <table
          className="table table-striped"
          style={{ marginTop: 0, marginBottom: "0px" }}
        >
          <tbody>
            {commentList()}
            <tr></tr>
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="text-sm text-gray-600 dark:text-gray-300 text-right">
          {formData.commentContent.length}/255
        </div>
        <div className="flex items-center mt-1 relative">
          <textarea
            ref={textareaRef}
            className={`comment-input custom-scrollbar custom-scrollbar-dark resize-none w-full max-h-9 
            ${
              formData.commentContent.length === 0
                ? "overflow-hidden"
                : "overflow-y-auto"
              }`}
            id="commentContent"
            name="commentContent"
            value={formData.commentContent}
            maxLength="255"
            onChange={(e) => {
              const inputValue = e.target.value;
              setFormData({ ...formData, commentContent: inputValue });

              const match = inputValue.match(/\.\/(\w*)$/);
              if (match) {
                const typedShortcut = match[1];
                const suggestions = findEmojiSuggestions(typedShortcut);
                setEmojiSuggestions(suggestions);
                setShowSuggestions(suggestions.length > 0);

                if (suggestions.length > 0) {
                  setShowEmojiPicker(false);
                }
              } else {
                setShowSuggestions(false);
              }
            }}
            onKeyDown={(e) => {
              // Check if the spacebar was pressed after typing emoji
              if (e.key === " ") {
                const inputValue = formData.commentContent;
                const replacedContent = handleEmojiReplacement(inputValue);
                setFormData({ ...formData, commentContent: replacedContent });
              }

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
                setShowEmojiPicker(false);
              }
            }}
            required
            placeholder="Write a comment..."
            style={{
              pointerEvents: "auto",
              position: "relative",
              zIndex: 10,
            }}
          />
          {showSuggestions && (
            <div className="ssu-suggestions-dropdown">
              {emojiSuggestions.map((emoji) => (
                <div
                  key={emoji.id}
                  className="ssu-suggestion-item"
                  onClick={() => {
                    const currentContent = formData.commentContent;
                    const newContent = currentContent.replace(
                      /\.\/\w*$/,
                      emoji.skins[0].native
                    );
                    setFormData({ ...formData, commentContent: newContent });
                    setShowSuggestions(false);
                  }}
                >
                  {emoji.skins[0].native} {emoji.id}
                </div>
              ))}
            </div>
          )}

          {/* Emoji Picker Button */}
          <div className="relative">
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={() => {
                if (!showEmojiPicker) {
                  setShowSuggestions(false);
                }
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="text-2xl bg-transparent cursor-pointer mr-1 ml-1 relative z-10 -mt-1"
            >
              {randomEmoji}
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-12 left-[-254px] z-50"
              >
                <Picker
                  onEmojiSelect={handleEmojiClick}
                  theme={
                    document.documentElement.classList.contains("dark")
                      ? "dark"
                      : "light"
                  }
                />
              </div>
            )}
          </div>
          <button type="submit" className="ml-2 " style={{ zIndex: 10 }}>
            <FontAwesomeIcon
              className="text-orange-500 text-2xl "
              icon={sendIcon}
            />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateComment;
