import {defineConfig} from 'vite-plugin-windicss';

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx,ts,js}'],
    exclude: ['node_modules', '.git', 'app'],
  },
  theme: {
    extend: {
      fontFamily: {
      },
      colors: {
        black: {
          900: '#1D2129'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
});