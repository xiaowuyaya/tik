const { getGlobal } = require('@electron/remote')

export function initRenderer() {
  global.$dll = getGlobal('$dll')
  global.$shell = getGlobal('$shell')
  global.$constant = getGlobal('$constant')
  global.$cache = getGlobal('$cache')
  global.$log = getGlobal('$log')
  global.$api = getGlobal('$api')
  global.$store = getGlobal('$store')
  global.$service = getGlobal('$service')
  global.$winManage = getGlobal('$winManage')
  global.$utils = getGlobal('$utils')
}
