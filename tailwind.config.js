/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        customBlue: '#575DAB',
      },
      fontFamily: {
        circular: ['"Circular Std"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

