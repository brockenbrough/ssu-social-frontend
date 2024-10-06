import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

function DarkModeButton() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDarkMode) setDarkMode(isDarkMode);
  }, []);

  const toggleTailwindTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode((prevMode) => !prevMode);
  };

  const handleClick = () => {
    toggleTailwindTheme();
  };

  return (
    <button
      id="darkModeButton"
      class="inline-flex items-center cursor-pointer"
      onClick={handleClick}
    >
      <span class="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Dark Mode
      </span>
      {darkMode ? (
        <input type="checkbox" value="" class="sr-only peer" checked />
      ) : (
        <input type="checkbox" value="" class="sr-only peer" />
      )}
      <div class="relative w-9 h-5 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    </button>
  );
}

export default DarkModeButton;
