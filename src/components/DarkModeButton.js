import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-regular-svg-icons'; // Import the icons

function DarkModeButton() {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const toggleTailwindTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode((prevMode) => !prevMode); // Update React state after DOM change
  }

  const handleClick = () => {
    //toggleDarkMode(); 
    toggleTailwindTheme();
  };

  return (
    <button
      onClick={handleClick}
      id="darkModeButton"
      style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
    >
      {isDarkMode ? 
      (<FontAwesomeIcon icon={faMoon} style={{ color: '#6B7280', fontSize: '28px' }} /> // Sun icon for light mode
      ) : (
      <FontAwesomeIcon icon={faSun} style={{ color: '#F59E0B', fontSize: '28px' }} /> // Moon icon for dark mode
      )}
    </button>
  );
}

export default DarkModeButton;