/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005A96',
        secondary: '#5D7285',
        background: '#E9EBEB'
      }
    },
  },
  plugins: [],
}

