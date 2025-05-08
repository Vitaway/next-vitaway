module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // Include the `app` directory for Next.js 13+
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#003E48",
          light: "#003E48",
          dark: "#003E48",
        },
        secondary: {
          DEFAULT: "#282e33",
          light: "#282e33",
          dark: "#282e33",
        },
        accent: {
          DEFAULT: "#E85A2E",
          light: "#E85A2E",
          dark: "#E85A2E",
        },
      },
    },
  },
  plugins: [],
};
