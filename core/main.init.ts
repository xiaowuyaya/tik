/**
 * 通用方法集
 */
import { cache } from "./tools/cache"
import * as store from './tools/store'
import * as utils from './tools/utils'
import * as consts from './tools/consts'
import * as api from './lcu/api'
import * as service from './lcu/service'
import { log } from './tools/log'

export async function initMain(): Promise<void> {
  return new Promise(async (resolve) => {
    // @ts-ignore
    global.$store = store
    // @ts-ignore
    global.$utils = utils
    // @ts-ignore
    global.$cache = cache
    // @ts-ignore
    global.$consts = consts
    // @ts-ignore
    global.$log = log
    // @ts-ignore
    global.$api = api
    // @ts-ignore
    global.$service = service


    resolve()
  })
}