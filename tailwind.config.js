/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'welding':"url('/src/welding.jpg')",
      },
    },
  },
  plugins: [],
}