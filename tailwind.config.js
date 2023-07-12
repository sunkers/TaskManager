/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#042326',
        secondary: '#0A3A40',
        accent: '#0F5959',
        success: '#1D7373',
        highlight: '#107361',
      },
    },
  },
  plugins: [],
}