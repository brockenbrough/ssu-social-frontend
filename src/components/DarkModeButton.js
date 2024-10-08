import React, { useEffect, useState } from "react";
import { useDarkMode } from "./DarkModeContext";

function DarkModeButton() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleClick = () => {
    toggleDarkMode();
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
