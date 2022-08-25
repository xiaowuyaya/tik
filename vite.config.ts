import { rmSync } from 'fs'
import { resolve, join } from 'path'
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
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import WindiCSS from 'vite-plugin-windicss'
import renderer from 'vite-plugin-electron-renderer'

rmSync('dist', { recursive: true, force: true }) // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        })
      ]
    }),
    WindiCSS(),
    electron({
      main: {
        entry: 'app/main/index.ts',
        vite: withDebug({
          build: {
            outDir: 'dist/app/main',
          },
        }),
      },
      preload: {
        input: {
          // You can configure multiple preload here
          index: join(__dirname, 'app/preload/index.ts'),
        },
        vite: {
          build: {
            // For Debug
            sourcemap: 'inline',
            outDir: 'dist/app/preload',
          },
        },
      },
      renderer: {
        resolve() {
          return ['getmac','electron-store', 'league-connect']
        },
      },
    }),
    renderer({
      resolve() {
        return ['getmac', 'league-connect']
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
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
