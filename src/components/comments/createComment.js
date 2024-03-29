import React, { useState, useEffect,createContext, useContext, } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import getUserInfo from "../../utilities/decodeJwt";
import { useDarkMode } from '../DarkModeContext';
import Post from "../post/post";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
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


function CreateComment({postId}) {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [commentCount, setCommentCount] = useState(0); // Comment count state
  const { darkMode } = useDarkMode();


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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/comments/comment/getCommentById/${postId}`, {
        method: "GET",
      })

      if (!response.ok) {
        const message = `An error occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      if(response != null){
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

  function commentList() {
    
    if (comments ==null)
    {
      return(
        <div>
          <h3>
            No Comment Found
          </h3>
          </div>
      );
    }
    return comments.map((comment) => {
      
      return (
        <Card
        body
        outline
        color="success"
        className="mx-0 my-0"
        style={{ width: "20rem" }}
      >
        <Card.Body>
          <Stack>
            <div>
              <p>{comment.commentContent}</p>
            </div>

          </Stack>
        </Card.Body>
      </Card>
      );
    });
  }

  const viewAllComments = () => {
    navigate("/comments/comment" , {state: postId});
  };


  return (
    <div className="container mt-4">
    <div>
      <h5 className="mb-4">Comments</h5>
      <table className="table table-striped" style={{ marginTop: 20 }}>
          <tbody>{commentList()}</tbody>
      </table>
    </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="commentContent" className="form-label">
            Comment?
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
            style={{ resize: "vertical", wordWrap: "break-word", backgroundColor: darkMode ? "#181818" : "#f6f8fa", color: darkMode ? "white": "black", }}
          />
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        

        </div>
      </form>
    </div>
  );
}


export default CreateComment;
