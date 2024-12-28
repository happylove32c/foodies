/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Adjust the path as per your project structure
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: "#FFAE3E", // Original yellow
          dark: "#E69734", // darker yellow
          light: "#FFD382", // Lighter yellow
        },
        red: {
          DEFAULT: "#D34A4B", // Original red
          dark: "#B03D3D", // darker red
          light: "#E28A8B", // Lighter red
        },
      },
    },
  },
  plugins: [],
};