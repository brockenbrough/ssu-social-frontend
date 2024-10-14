/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}", // Make sure this covers all your JSX/TSX files
  ],
  darkMode: "selector",
  theme: {
    fontFamily: {
      title: ["Montserrat", "sans-serif"],
      display: ["Poppins", "sans-serif"],
      menu: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        darkBackground: '#171717',
        lightBackground: '#fff7ed',
        darkMainText: '#1d4ed8', // blue color
        lightMainText: '#422006', // dark brown
        darkUserText: '#f5f5f5', // white
        lightUserText: '#2563eb', // light blue
        darkErrorMessage: '#450a0a', // red
        lightErrorMessage: '#450a0a', // cranberry
        iconBorder: '#ea580c', // orange
        darkHover: '#f5f5dc', // cream for toggle
        lightHover: '#2563eb', // light blue for toggle
      },
    },
  },
  plugins: [],
};