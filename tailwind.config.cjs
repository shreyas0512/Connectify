/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: "#40A763",
        textgreen: "#4C9246",
        bgcolor: "#F0F0F0",
        white: "#F9F8F8",
        placeholder: "#939393",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
