const { BrowserWindow } = require('electron')
const { browserConfig } = require('../store/index')
const fs = require('fs')
const path = require('path')
const winax = require('winax')
const { Utils } = require('ee-core');
const { dialog, app, screen } = require('electron')
const { execSync } = require('child_process')
const dayjs = require('dayjs')

const fsExistsSync = path => {
  try {
    fs.accessSync(path, fs.F_OK)
  } catch (e) {
    return false
  }
  return true
}

function createDir(baseUrl) {
  if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl)
  }
}

const registerDmDll = () => {
  const filePath = path.join(Utils.getExtraResourcesDir(), 'dll', 'dm.dll') 
  const exists = fsExistsSync(filePath)
  if (exists) {
    try {
      return new winax.Object('dm.dmsoft')
    } catch (err) {
      execSync(`regsvr32 "${filePath}" /s`) // 添加双引号 以防出现 Program Files 自带空格问题
      return new winax.Object('dm.dmsoft')
    }
  } else {
    dialog.showMessageBox({
      type: 'error',
      title: '检测到dm.dll文件不存在',
      message: `请检查 ${filePath} 是否存在？\n 您可以无视这个警告，但是您将无法正常使用完整功能\n或加群联系管理查找解决方案`,
    })
  }
}

const dm = registerDmDll()

exports.sendStringInProgress = (ctx, msg) => {
  try {
    const hwnd1 = dm.findWindow('', 'League of Legends (TM) Client')
    if (!hwnd1) {
      return
    }
    dm.setWindowState(hwnd1, 1)
    dm.setKeypadDelay('normal', 100)
    dm.keyPress(13)
    dm.sendString(hwnd1, `${msg} 来自：Tik 英雄联盟对局助手`)
    dm.keyPress(13)
  } catch (err) {
    ctx.logger.error(`[win32] send string in progress throw an error: ${err}`)
  }
}

exports.screenshot = (ctx, fileName) => {
  try {
    const date = dayjs().format('YYYY-MM-DD')
    const time = dayjs().format('YYYYMMDDHHmmss')
    const savaDir = path.join(app.getPath('userData'), 'screenshot', date)
    createDir(path.join(app.getPath('userData'), 'screenshot'))
    createDir(savaDir)
    const file = path.join(savaDir, `${time}_${fileName}.png`)
    const size = screen.getPrimaryDisplay().workAreaSize
    dm.capturePng(0, 0, size.width, size.height, file)
    return file
  } catch (err) {
    ctx.logger.error(`[win32] screenshot throw an error: ${err}`)
  }
}

exports.windowKeepTop = windowTitle => {
  const hwnd1 = dm.findWindow('', windowTitle)
  if (!hwnd1) return
  dm.setWindowState(hwnd1, 8)
}

exports.sendSpellsInfo = (ctx, championName, summonerName, spellName, cooldownBurn, curTime) => {
  const spellsWindowId = browserConfig.get('browserWindows.spellsWindow')
  const spellWindow = BrowserWindow.fromId(spellsWindowId)
  const hwnd1 = dm.findWindow('', 'TIK SPELLS')
  if (!hwnd1) return
  dm.setWindowState(hwnd1, 9)
  spellWindow.hide()
  this.sendStringInProgress(ctx, `${championName}:${summonerName} 已使用 ${spellName}, 技能将在${curTime} 冷却完毕`)
  setTimeout(() => {
    this.sendStringInProgress(ctx, `${championName}:${summonerName} 的 ${spellName}冷却时间还剩 30秒`)
  }, (cooldownBurn - 30) * 1000)
  setTimeout(() => {
    this.sendStringInProgress(ctx, `${championName}:${summonerName} 的 ${spellName}已转好`)
  }, cooldownBurn * 1000)
}
