import { app, dialog, nativeImage } from "electron";
import path from 'path'
import fs from 'fs'
import winax from 'winax'
import { execSync } from 'child_process'

const DM_DLL_PATH = app.isPackaged ? path.join(app.getPath('exe'), 'extraResources', 'dm.dll') : path.join(process.env.DIST_ELECTRON,'..', 'extraResources', 'dm.dll')

function regsvrDm() {
  console.log(DM_DLL_PATH);
  
  if (fsExistsSync(DM_DLL_PATH)) {
    try {
      return new winax.Object('dm.dmsoft')
    } catch (err) {
      execSync(`regsvr32 "${DM_DLL_PATH}" /s`) // 添加双引号 以防出现 Program Files 自带空格问题
      return new winax.Object('dm.dmsoft')
    }
  } else {
    const iconPath = path.join(process.env.PUBLIC as string, 'tray.ico')
    const image = nativeImage.createFromPath(iconPath)
    image.isMacTemplateImage = true
    dialog.showMessageBox({
      icon: image,
      title: `警告`,
      detail:`请检查 ${DM_DLL_PATH} 是否存在？\n您可以无视这个警告，但是您将无法正常使用完整功能（如游戏内发送战绩，荣誉截图等）\n或加群联系管理查找解决方案`,
      message: `检测到dm.dll文件不存在`,
      defaultId: 0,
      cancelId: 0,
      buttons: ['好的']
    })
  }
}

const dm = regsvrDm()

export function sendStringInProgress(msg: string){
  try {
    const hwnd1 = dm.findWindow('', 'League of Legends (TM) Client')
    if (!hwnd1) {
      return
    }
    dm.setWindowState(hwnd1, 1)
    dm.setKeypadDelay('normal', 100)
    dm.keyPress(13)
    dm.sendString(hwnd1, `${msg}`)
    dm.keyPress(13)
  } catch (err) {
    $tools.log.error(`[win32] send string in progress throw an error: ${err}`)
  }
}

export function windowKeepTop(windowTitle: string){
  const hwnd1 = dm.findWindow('', windowTitle)
  if (!hwnd1) return
  dm.setWindowState(hwnd1, 8)
}

export function fsExistsSync(path: string) {
  try {
    // @ts-ignore
    fs.accessSync(path, fs.F_OK)
  } catch (e) {
    return false
  }
  return true
}