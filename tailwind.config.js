/** @type {import('tailwindcss').Config} */
const { heroui, colors } = require("@heroui/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0c0bc0",
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
