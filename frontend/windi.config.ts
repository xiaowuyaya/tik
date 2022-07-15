import { defineConfig } from 'vite-plugin-windicss';
import colors from 'windicss/colors'

export default defineConfig({
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx,ts,js}'],
    exclude: ['node_modules', '.git'],
  },
  theme: {
    extend: {
      fontFamily: {
        pingfang: ["SC-S", "SC-t", 'Myriad Pro', 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', 'sans-serif'],
        youshe: ["YouShe"]
      },
      colors: {
        custom: {
          grayBlue: '#293146',
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [
    require('@windicss/plugin-question-mark'),
  ],
});