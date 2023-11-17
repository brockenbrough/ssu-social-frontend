import React from 'react';
import { useDarkMode } from './DarkModeContext';

function DarkModeButton() {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Change 'setDarkMode' to 'toggleDarkMode'

  const handleClick = () => {
    toggleDarkMode(); // Call the 'toggleDarkMode' function to switch dark mode
  };

  return (

    <button onClick={handleClick} id="darkModeButton" style={{ background: 'transparent', border: 'none',}}>
       {darkMode ? <img src="/lightbutton.png" alt="Light Mode" style={{ width: '50px', height: '50px' }} /> : <img src="/darkbutton.png" alt="Dark Mode" style={{ width: '50px', height: '50px' }} />}
    </button>

  );
}

export default DarkModeButton;