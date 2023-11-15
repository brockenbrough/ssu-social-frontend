import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import getUserInfoAsync from "../../utilities/decodeJwtAsync";
import { Link } from "react-router-dom";
import { useDarkMode } from '../DarkModeContext';


const CreatePost = () => {

  // User UseStates
  const [user, setUser] = useState(null);
  const [state, setState] = useState({
    content: "",
  });


  const fetchUserInfo = async () => {
    try {
    const userInfo = await getUserInfoAsync();
    if (userInfo) {
    setUser(userInfo);
    }
    } catch (error) {
  
    console.error("Error fetching user info:", error);
  }
  };
  useEffect(() => {
  fetchUserInfo(); // Fetch user info
  }, []);
  const navigate = useNavigate();

  //State for TextArea
  const handleTextChange = (e) => {
    setTextAreaCount(e.target.value.length);  //used for char counting
    if (textAreaCount === maxText - 1 || textAreaCount === maxText) {
      setColor('red');
    }
    else if (textAreaCount / maxText >= .75) {
      setColor('gold');
    }
    else {
      setColor('gainsboro')
    }
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  //Dark Mode components.
  const { darkMode } = useDarkMode();
  const [textAreaCount, setTextAreaCount] = React.useState(0);
  const maxText = 280;
  var [color, setColor] = React.useState('gainsboro');

  //Submission API's
  const [selectedImage, setSelectedImage] = useState(null); //State to store selectedImage.

  const handleImageClick = () => {
    document.getElementById('image').click();
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]); //Store the selectedImage

    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = function (event) {
        const imgPreview = event.target.result;
        document.getElementById('imagePreview').src = imgPreview; // Display the selected image
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let post = {}; // Initialize the post object outside the if-else block
  
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);
  
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/create`, {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          alert(`Image created successfully.`);
  
          // Construct the post object with the imageId
          const { content } = state;
          post = {
            id: user.id,
            content,
            username: user.username,
            imageId: data.imageId,
          };
        } else {
          alert('Image was not saved. HTTP status code: ' + response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    try {
      // Send Posts to Post API
      const { content } = state;
      post = {
        ...post, // Add imageId if available or keep the previous 'post' object
        id: user.id,
        content,
        username: user.username,
      };
  
      const postResponse = await axios.post(`${process.env.REACT_APP_BACKEND_SERVER_URI}/posts/createPost`, post);
      navigate("/getAllPost");
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  

  if (!user) {
    return (
      <div>
        <h3>
          You are not authorized to view this page, Please Login in{" "}
          <Link to={"/login"}>
            <a href="#">here</a>
          </Link>
        </h3>
      </div>
    );
  }

  return (
    <>
      <div className="App">
        <Form
          id="createPostID"
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", 
                  backgroundColor: "#f6f8fa", backgroundColor: darkMode ? "#000" : "#f6f8fa", color: darkMode ? "#fff" : "#000",
                }}
        >
          <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: "60%" }} >
            <Form.Control as="textarea" maxlength="280" placeholder="What's on your mind?" name="content" value={state.content} onChange={handleTextChange}
              style={{ marginTop: '-16%', height: "3.5cm", width: "100%", backgroundColor: darkMode ? "#181818" : "white", color: darkMode ? "white" : "#000", fontSize : '25px', fontFamily:'Times New Roman, Times, serif'}}/>

            <p> <span style={{ color: color }} onChange={handleTextChange}> {" "}{`${textAreaCount}/${maxText}`}{" "} </span> </p>
          </Form.Group>

          <div name="img-icon" onClick={handleImageClick} style={{ display: "flex", justifyContent: "space-between", width: "60%", height: '100px' }} >
            
            <img
              src={darkMode ? "/addImageLight.png" : "/add-img-icon.png"}
              alt="Add Image Icon"
              style={{ width: "85px", height: "85px", marginTop: ".5cm" }}
            />
          </div>

          <input type="file" id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange} //Call handleImageChange on file selection.
            style={{
              width: "100%",
              padding: "8px",
              marginLeft: "610px",
              display: 'none',
            }} />
            
            
            {selectedImage && ( // Use the 'selectedImage' state to conditionally display the image preview and text message
          <div>
            {/* <h4>Selected Image is:</h4> */}
            <img id="imagePreview" alt="Selected Image" style={{ width: "300px", height: "auto", }}
             src={URL.createObjectURL(selectedImage)} />
          </div>
        )}
        
          <Button style={{ width: "9cm",height : '5%', marginTop: "1cm", backgroundColor: "#28a745", borderColor: "#28a745", }} variant="primary" type="submit" size="lg">
            Create Post
          </Button>
        </Form>
      </div>
    </>
  );
};
export default CreatePost;