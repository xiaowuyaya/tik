import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, ArcoResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(), 
    WindiCSS(), 
    AutoImport({
    resolvers: [ElementPlusResolver(), ArcoResolver()],
  }), 
  Components({
    resolvers: [ElementPlusResolver(), ArcoResolver({
      sideEffect: true,
    })],
  }),],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: './',
  server: {
    port: 7333,
    cors: true,
  }
})
