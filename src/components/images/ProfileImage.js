import React from "react";
import { Image } from "react-bootstrap";
import { useDarkMode } from "../DarkModeContext";



const ProfileImage = () => {
    const { darkMode } = useDarkMode();
 

    return (<Image
        roundedCircle
        src={"ProfileIcon.png"}
        alt="Profile Icon"
        style={{ background: darkMode ? '#181818' : 'white',
        color: darkMode ? 'white' : 'black',
        border: darkMode ? '1px solid white' : '1px solid black',
        marginLeft: '10px' }}
      />);
};

export default ProfileImage;