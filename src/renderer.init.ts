import { getGlobal } from '@electron/remote'

export function initRenderer(): void {
  // @ts-ignore
  global.$tools = getGlobal('$tools')
  // @ts-ignore
  global.$store = getGlobal('$store')
  // @ts-ignore
  global.$utils = getGlobal('$utils')
  // @ts-ignore
  global.$api = getGlobal('$api')


}
