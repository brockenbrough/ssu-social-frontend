import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useDarkMode } from "../DarkModeContext";
import axios from "axios";

const ProfileImage = ({ username }) => {
    const { darkMode } = useDarkMode();
    const [profileImageUrl, setProfileImageUrl] = useState("ProfileIcon.png"); // default image
    
    useEffect(() => {
        // Fetch the user's profile image if available
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getProfileImage/${username}`);
                if (response.data.imageUri) {
                    setProfileImageUrl(response.data.imageUri); // Use the fetched profile image URL
                }
            } catch (error) {
                console.error("Error fetching profile image:", error);
                // If there is an error, default image will remain
            }
        };

        if (username) {
            fetchProfileImage(); // Fetch only if username exists
        }
    }, [username]);

    return (
        <Image
            roundedCircle
            src={profileImageUrl}
            alt="Profile Icon"
            style={{
                background: darkMode ? '#181818' : 'white',
                color: darkMode ? 'white' : 'black',
                border: darkMode ? '1px solid white' : '1px solid black',
                marginLeft: '10px',
                width: '100px',  // Adjust size as needed
                height: '100px'  // Adjust size as needed
            }}
        />
    );
};

export default ProfileImage;