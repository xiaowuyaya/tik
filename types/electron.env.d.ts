/// <reference types="vite-electron-plugin/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    PUBLIC: string
    RESOURCE: string
  }
}

import { cache } from "../core/tools/cache"
import * as store from '../core/tools/store'
import * as utils from '../core/tools/utils'
import {log} from '../core/tools/log'
import * as consts from '../core/tools/consts'
import * as api from '../core/lcu/api'
import * as service from '../core/lcu/service'

type Cache = typeof cache
type Store = typeof store
type Utils = typeof utils
type Consts = typeof consts
type Log = typeof log
type Api = typeof api
type Service = typeof service

declare global {
  const $store: Store
  const $utils: Utils
  const $cache: Cache
  const $consts: Consts
  const $log: Log
  const $api: Api
  const $service: Service
}
