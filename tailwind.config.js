/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGold: "#9181F4",
        customBlue: "#5038ED",
        inputBG: "#F0EDFF",
      },
    },
  },
  plugins: [],
};
