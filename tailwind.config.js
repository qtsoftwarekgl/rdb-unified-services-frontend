/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#005A96",
        secondary: "#5D7285",
        tertiary: "#3E9DFD",
        background: "#E9EBEB",
      },
    },
  },
};
