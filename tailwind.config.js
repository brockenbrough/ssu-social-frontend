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
    extend: {},
  },
  plugins: [],
};
