/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.html',
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './assets/js/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        'serif-jp': ['"Noto Serif JP"', 'serif'],
      },
    },
  },
  plugins: [],
}
