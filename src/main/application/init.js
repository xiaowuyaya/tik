import * as constant from '../tools/constant'
import cache from '../tools/cache'
import log from '../tools/log'
import * as store from '../tools/store'
import * as winManage from './window'
import * as utils from '../tools/utils'
import * as api from '../core/api'
import * as service from '../core/service'
import * as dll from '../tools/dll'
import { shell } from 'electron'

export default async function initMain() {
  /* electron remote 模块主进程初始化 */
  require('@electron/remote/main').initialize()

  return new Promise(resolve => {
    global.$dll = dll
    global.$constant = constant
    global.$shell = shell
    global.$cache = cache
    global.$api = api
    global.$log = log
    global.$store = store
    global.$service = service
    global.$winManage = winManage
    global.$utils = utils

    resolve()
  })
}
