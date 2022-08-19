import { rmSync } from 'fs'
import { resolve } from 'path'
import {
  type Plugin,
  type UserConfig,
  defineConfig,
} from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import pkg from './package.json'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { TDesignResolver } from 'unplugin-vue-components/resolvers';
import WindiCSS from 'vite-plugin-windicss'
import renderer from 'vite-plugin-electron-renderer'

rmSync('dist', { recursive: true, force: true }) // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
    Components({
      resolvers: [TDesignResolver({
        library: 'vue-next'
      })],
    }),
    WindiCSS(),
    electron({
      main: {
        entry: 'app/index.ts',
        vite: withDebug({
          build: {
            outDir: 'dist/',
          },
        }),
      },
      // preload: {
      //   input: {
      //     // You can configure multiple preload here
      //     index: path.join(__dirname, 'electron/preload/index.ts'),
      //   },
      //   vite: {
      //     build: {
      //       // For Debug
      //       sourcemap: 'inline',
      //       outDir: 'dist/electron/preload',
      //     },
      //   },
      // },
      // Enables use of Node.js API in the Renderer-process
      // https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
    }),
    renderer({
      resolve(){
        return ['getmac','electron-store']
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
})

function withDebug(config: UserConfig): UserConfig {
  if (process.env.VSCODE_DEBUG) {
    if (!config.build) config.build = {}
    config.build.sourcemap = true
    config.plugins = (config.plugins || []).concat({
      name: 'electron-vite-debug',
      configResolved(config) {
        const index = config.plugins.findIndex(p => p.name === 'electron-main-watcher');
        // At present, Vite can only modify plugins in configResolved hook.
        (config.plugins as Plugin[]).splice(index, 1)
      },
    })
  }
  return config
}
