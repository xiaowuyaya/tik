import { defineConfig } from 'vite-plugin-windicss';
import colors from 'windicss/colors'

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx,ts,js}'],
    exclude: ['node_modules', '.git'],
  },
  theme: {
    extend: {

    },
  },
  darkMode: 'class',
  plugins: [
    require('@windicss/plugin-question-mark'),
  ],
});