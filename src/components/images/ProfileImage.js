import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useDarkMode } from "../DarkModeContext";
import axios from "axios";

const ProfileImage = ({ username }) => {
    const { darkMode } = useDarkMode();
    const [profileImageUrl, setProfileImageUrl] = useState(""); 

    // Use the publicly available S3 URL for the default profile image
    const defaultProfileImageUrl = "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png"; 

    useEffect(() => {
        // Fetch the user's profile image if available
        const fetchProfileImage = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/user/getUserByUsername/${username}`);
                if (response.data.profileImage) {
                    setProfileImageUrl(response.data.profileImage); // Use the fetched profile image URL
                } else {
                    setProfileImageUrl(defaultProfileImageUrl); // Set the default profile image if no custom image
                }
            } catch (error) {
                console.error("Error fetching profile image:", error);
                setProfileImageUrl(defaultProfileImageUrl); // Set the default profile image on error
            }
        };

        if (username) {
            fetchProfileImage(); // Fetch the profile image only if the username exists
        } else {
            setProfileImageUrl(defaultProfileImageUrl); // Set the default image if no username is provided
        }
    }, [username]);

    return (
        <Image
            roundedCircle
            src={profileImageUrl || defaultProfileImageUrl}
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