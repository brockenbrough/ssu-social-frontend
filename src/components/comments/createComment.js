import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";

function CreateComment() {
  const [user, setUser] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Use the useEffect hook to run code after the component has rendered.
    const currentUser = getUserInfo(); // Decode the JWT token to get user info.
    setUser(currentUser); // Set the user state with the decoded user info.
  }, []);

  const [formData, setFormData] = useState({
    commentContent: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        navigate(`/getallpost`);
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

  // Navigate back to view all comments
  const viewAllComments = () => {
    navigate("/comments/comment");
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
            rows="4" // Set the number of visible rows
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

          <button
            type="View All Comments"
            className="btn btn-primary"
            onClick={viewAllComments}
          >
            View All Comments 
          </button>
         
        </div>
      </form>
    </div>
  );
}

export default CreateComment;
