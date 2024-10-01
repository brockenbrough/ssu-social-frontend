import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getUserInfo from '../../utilities/decodeJwt';
import { useDarkMode } from '../DarkModeContext';

export default function UploadImages() {
  const { darkMode } = useDarkMode();
  const [user, setUser] = useState({});
  const [name, setName] = useState(""); 

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const userInfo = await getUserInfo();
      if (userInfo) {
        setUser(userInfo);
        setName(userInfo.username);  // Set name to user’s username directly
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (!user.username) {
    return (
      <div>
        <h3>
          You are not authorized to view this page. Please Login{' '}
          <Link to={'/login'}>here</Link>
        </h3>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', user.username); // Attach username to formData
    formData.append('image', e.target.elements.image.files[0]); // Get the image file

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/create`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded:', data);
        alert(data.message);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert('Image was not saved. HTTP status code: ' + response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: darkMode ? "#181818" : "#f6f8fa",
        color: darkMode ? "#fff" : "#000",
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1 style={{ textAlign: 'center', color: darkMode ? 'white' : '#333' }}>
        Upload Images
      </h1>

      <div style={{ marginTop: '20px' }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="name"
              style={{ display: 'block', marginBottom: '5px', color: darkMode ? "#fff" : "#555" }}
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              placeholder={user.username}
              value={name}
              disabled
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: darkMode ? "#181818" : "#f6f8fa",
                color: darkMode ? "#fff" : "#000",
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label
              htmlFor="image"
              style={{ display: 'block', marginBottom: '5px', color: darkMode ? "#fff" : "#555" }}
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: darkMode ? "#181818" : "#f6f8fa",
              }}
            />
          </div>
          <div style={{ marginBottom: '15px', display: 'flex' }}>
            <button
              type="submit"
              style={{
                flex: 2,
                backgroundColor: '#4caf50',
                color: '#fff',
                padding: '10px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '5px',
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <hr style={{ marginTop: '20px' }} />
    </div>
  );
}