const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['PingFang', ...defaultTheme.fontFamily.sans],
        youshe: ['YouShe', ...defaultTheme.fontFamily.sans],
      },
      colors: {},
    },
  },
  plugins: [],
}
