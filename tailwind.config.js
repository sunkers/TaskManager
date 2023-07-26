/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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