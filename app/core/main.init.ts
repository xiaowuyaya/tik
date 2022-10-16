process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

import { join } from 'path'
import { app } from 'electron'

// Remove electron security warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'


import * as tools from './tools'
import * as store from './store'
import * as utils from './utils'
import * as api from './lcu/api'

export async function initMain(): Promise<void> {
  return new Promise(async (resolve) => {
    // @ts-ignore
    global.$tools = tools
    // @ts-ignore
    global.$store = store
    // @ts-ignore
    global.$utils = utils
    // @ts-ignore
    global.$api = api

    resolve()
  })
}