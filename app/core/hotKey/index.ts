import iohook from 'iohook'
import { panelEvent, muteAllEvent } from './event'

export async function createHotKeyListen() {
  await panelEvent()
  await muteAllEvent()
  iohook.start()
}