import React from 'react';
import { useDarkMode } from './DarkModeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'; // Import the icons

function DarkModeButton() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleClick = () => {
    toggleDarkMode(); // Toggle dark mode
  };

  return (
    <button onClick={handleClick} id="darkModeButton" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
      {darkMode ? (
        <FontAwesomeIcon icon={faSun} style={{ color: '#F59E0B', fontSize: '42px' }} /> // Sun icon for light mode
      ) : (
        <FontAwesomeIcon icon={faMoon} style={{ color: '#6B7280', fontSize: '42px' }} /> // Moon icon for dark mode
      )}
    </button>
  );
}

export default DarkModeButton;
