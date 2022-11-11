import { getGlobal } from '@electron/remote'

export function initRenderer(): void {
  // @ts-ignore
  global.$store = getGlobal("$store")
  // @ts-ignore
  global.$utils = getGlobal("$utils")
  // @ts-ignore
  global.$cache = getGlobal("$cache")
  // @ts-ignore
  global.$consts = getGlobal("$consts")
  // @ts-ignore
  global.$log = getGlobal("$log")
  // @ts-ignore
  global.$api = getGlobal("$api")
  // @ts-ignore
  global.$service = getGlobal("$service")

}
