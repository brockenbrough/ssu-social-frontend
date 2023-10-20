import React from 'react';
import { useDarkMode } from './DarkModeContext';

function DarkModeButton() {
  const { darkMode, toggleDarkMode } = useDarkMode(); // Change 'setDarkMode' to 'toggleDarkMode'

  const handleClick = () => {
    toggleDarkMode(); // Call the 'toggleDarkMode' function to switch dark mode
  };

  return (
    <button onClick={handleClick} id="darkModeButton">
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

export default DarkModeButton;