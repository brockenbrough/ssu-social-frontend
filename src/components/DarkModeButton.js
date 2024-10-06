import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

function DarkModeButton() {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const toggleTailwindTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleClick = () => {
    toggleTailwindTheme();
  };

  return (
    <button
      onClick={handleClick}
      id="darkModeButton"
      style={{ background: "transparent", border: "none", cursor: "pointer" }}
    >
      {isDarkMode ? (
        <FontAwesomeIcon
          icon={faMoon}
          style={{ color: "#6B7280", fontSize: "28px" }}
        />
      ) : (
        <FontAwesomeIcon
          icon={faSun}
          style={{ color: "#F59E0B", fontSize: "28px" }}
        />
      )}
    </button>
  );
}

export default DarkModeButton;
