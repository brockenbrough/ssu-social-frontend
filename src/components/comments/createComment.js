import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    commentContent: '',
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        // Comment created successfully, navigate back to the post page
        navigate(`/getallpost`);
      } else {
        // Handle errors if needed
        console.error('Error:', response.status);
        // Handle the error and provide user feedback
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle any other errors that may occur during the fetch request
      // Provide user feedback as needed
    }
  };

  const handleCancel = () => {
    // Navigate back to the post page
    navigate(`/getallpost`);
  };  

  return (
    <div>
      <h1>Create Comment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="commentContent">Comment Content</label>
          <input
            type="text"
            className="form-control"
            id="commentContent"
            name="commentContent"
            value={formData.commentContent}
            onChange={(e) => setFormData({ ...formData, commentContent: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default CreateComment;
