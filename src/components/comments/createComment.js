import React, {
  useState,
  useEffect,
  useLayoutEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { useDarkMode } from "../DarkModeContext";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import timeAgo from "../../utilities/timeAgo";
const CommentCountContext = createContext();

export function CommentCountProvider({ children }) {
  const [commentCount, setCommentCount] = useState(0);

  return (
    <CommentCountContext.Provider value={{ commentCount, setCommentCount }}>
      {children}
    </CommentCountContext.Provider>
  );
}

export function useCommentCount() {
  return useContext(CommentCountContext);
}

function CreateComment({ postId, setParentCommentCount, postCardHeight, hasMedia }) {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0); // Comment count state
  const { darkMode } = useDarkMode();
  const commentsEndRef = useRef(null);

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

  const [formData, setFormData] = useState({
    commentContent: "",
  });

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

        // Update comments
        setComments([...comments, newComment]);

        // Fetch comment count and comments
        fetchCommentCount();
        fetchComments();
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
    return comments.map((comment) => {
      return (
        <Card
          body
          outline
          color="success"
          className="mx-0 my-2"
          style={{
            width: "100%",
            color: darkMode ? "white" : "black",
            backgroundColor: darkMode ? "#181818" : "#f6f8fa",
            borderColor: darkMode ? "#f6f8fa" : "#181818",
          }}
        >
          <Card.Body
            style={{
              margin: "0",
              padding: "0",
              color: darkMode ? "white" : "black",
              backgroundColor: darkMode ? "#181818" : "#f6f8fa",
            }}
          >
            <Stack>
              <span>
                <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
                  <Link
                    id="username"
                    to={
                      user.username === comment.username
                        ? "/privateUserProfile"
                        : `/publicProfilePage/${comment.username}`
                    }
                    style={{
                      color: darkMode ? "white" : "black",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    @{comment.username}
                  </Link>
                </span>
                <span style={{ marginLeft: "5px", fontSize: "0.8rem" }}>
                  {timeAgo(comment.date)}
                </span>
                <br />
                <span
                  style={{
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {comment.commentContent}
                </span>
              </span>
            </Stack>
          </Card.Body>
        </Card>
      );
    });
  }

  return (
    <div className="container mt-4">
      <div>
        <span className="mb-4">
          <span
            style={{
              fontSize: "1.2rem",
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
        style={{
          maxHeight: `${postCardHeight * 0.38 }px`,
          overflowY: "scroll", 
          marginTop: "20px",
          paddingBottom: "0px",
          paddingRight: "13px",
          borderRadius: "5px",
        }}
      >
        <table className="table table-striped" style={{ marginTop: 0 }}>
          <tbody>
            {commentList()}
            <tr></tr>
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center mt-3">
          <input
            type="text"
            className="form-control"
            id="commentContent"
            name="commentContent"
            value={formData.commentContent}
            onChange={(e) =>
              setFormData({ ...formData, commentContent: e.target.value })
            }
            required
            placeholder="Write a comment..."
            style={{
              width: "88%",
              marginRight: "2%",
              backgroundColor: darkMode ? "#181818" : "#f6f8fa",
              color: darkMode ? "white" : "black",
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 10,
            }}
          />
          <button
            type="submit"
            className="btn btn-primary d-flex justify-content-center align-items-center"
            style={{ width: "10%", paddingRight: "16px", zIndex: 10, }}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateComment;
