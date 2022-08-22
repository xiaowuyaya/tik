import { defineConfig } from 'vite-plugin-windicss';

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx,ts,js}'],
    exclude: ['node_modules', '.git'],
  },
  theme: {
    extend: {
      colors: {
        title: '#ecf7fb',
        light: {
          hover: '#f3f3f3',
          focus: '#e8e8e8',
        }
      },
      fontFamily: {
        title: "AliShuHei",
        test: "Noto Sans SC"
      }
    },
  },
  darkMode: 'class',
  plugins: [
  ],
});