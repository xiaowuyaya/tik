/// <reference types="vite-electron-plugin/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    /** /dist/ or /public/ */
    PUBLIC: string
  }
}

import * as tools from '../app/core/tools'
type Tools = typeof tools
import * as store from '../app/core/store'
type Store = typeof store
import * as utils from '../app/core/utils'
type Utils = typeof utils
import * as api from '../app/core/lcu/api'
type API = typeof api


declare global {
  const $tools: Tools
  const $store: Store
  const $utils: Utils
  const $api: API
}
