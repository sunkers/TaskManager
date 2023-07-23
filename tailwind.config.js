/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {
      // backgroundImage: theme => ({
      //   'custom-background': "url('/public/images/background.png')",
      // }),
      backdropBlur: {
        'none': '0',
        'blur': 'blur(20px)',
      },
      colors: {
        primary: '#042326',
        secondary: '#0A3A40',
        accent: '#0F5959',
        success: '#1D7373',
        highlight: '#107361',
      },
      fontFamily: {
        invisible: ['Invisible'],
      },
    },
  },
  plugins: [],
}