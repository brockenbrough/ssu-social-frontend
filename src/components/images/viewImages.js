import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserInfoAsync } from "../../utilities/decodeJwtAsync";
import { useDarkMode } from "../DarkModeContext";

export default function ViewImages() {
  const { darkMode } = useDarkMode();
  const [user, setUser] = useState({});
  const [images, setImages] = useState([]);

  // Fetch user info
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
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (user.username) {
      fetchImages();
    }
  }, [user]);

  // Fetch images from the backend
  const fetchImages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/getAll`);
      const data = await response.json();
      setImages(data);
      console.log(data); // Debug: Check what the data contains
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Remove image
  const handleRemoveImage = async (imageUri) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/images/${imageUri}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the images state after successful deletion
        setImages(images.filter((image) => image.uri !== imageUri));
      } else {
        const data = await response.json();
        console.error("Error removing image:", data.message);
      }
    } catch (error) {
      console.error("Error removing image:", error);
    }
  };

  if (!user.username) {
    return (
      <div>
        <h3>
          You are not authorized to view this page. Please log in{" "}
          <Link to={"/login"}>here</Link>.
        </h3>
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        background: darkMode ? "black" : "white",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "28px", color: darkMode ? "white" : "#333" }}>View Images</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              margin: "10px",
              padding: "15px",
              width: "300px",
              background: darkMode ? "#181818" : "#f6f8fa",
            }}
          >
            <img
              src={image.uri} // Use the `uri` from your backend for the S3 image URL
              alt={image.name}
              style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
            />
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "red",
                transition: "color 0.3s ease",
              }}
              onClick={() => handleRemoveImage(image.uri)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <hr style={{ border: "1px solid #ccc", margin: "20px 0" }} />
    </div>
  );
}