import React, { useState, useEffect,createContext, useContext, } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";


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
function CreateComment() {
  const [user, setUser] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0); // Comment count state


  useEffect(() => {
    // Use the useEffect hook to run code after the component has rendered.
    const currentUser = getUserInfo(); // Decode the JWT token to get user info.
    setUser(currentUser); // Set the user state with the decoded user info.


    // Fetch the comment count for the specific post
    fetchCommentCount();
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


  const [formData, setFormData] = useState({
    commentContent: "",
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentCount(commentCount + 1);


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
        // Comment created successfully, navigate back to the post page
        navigate("/comments/comment" , {state: postId});
       
        // After successfully creating a comment, update the comment count
        fetchCommentCount();
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


  const handleCancel = () => {
    // Navigate back to the post page
    navigate(`/getallpost`);
  };


  const viewAllComments = () => {
    navigate("/comments/comment" , {state: postId});
  };


  return (
    <div className="container mt-4">
      <h1 className="mb-4">Create Comment</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="commentContent" className="form-label">
            What do you want to say?
          </label>
          <textarea
            rows="4"
            className="form-control"
            id="commentContent"
            name="commentContent"
            value={formData.commentContent}
            onChange={(e) =>
              setFormData({ ...formData, commentContent: e.target.value })
            }
            required
            style={{ resize: "vertical", wordWrap: "break-word" }}
          />
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={viewAllComments}>
            View All Comments ({commentCount}){/* Display the comment count */}
          </button>
        </div>
      </form>
    </div>
  );
}


export default CreateComment;
