import { BrowserWindow } from 'electron';
import winax from 'winax'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import { dialog, shell, screen, app } from 'electron'
import dayjs from 'dayjs'

const registerDm = () => {
  let filePath: string 
  if(app.isPackaged){
    filePath = path.join(app.getPath('exe'), 'resources', 'extraResources', 'dll', 'dm.dll')
  }else{
    filePath = path.join(__dirname, '../../../', 'resources', 'dll', 'dm.dll')
  }
  console.log(filePath);
  
  // 判断文件是否存在
  const exists = fsExistsSync(filePath);
  if (exists) {
    try {
      return new winax.Object('dm.dmsoft');
    } catch (err) {
      execSync(`regsvr32 "${filePath}" /s`);
      return new winax.Object('dm.dmsoft');
    }
  } else {
    dialog
      .showMessageBox({
        type: 'error',
        title: '检测到dm.dll文件不存在',
        message: `请检查 ${filePath} 是否存在？\n 您可以无视这个警告，但是您将无法正常使用完整功能`,
        buttons: ['无视', '如何解决'],
      })
      .then((buttonIndex) => {
        if (buttonIndex.response === 1) {
          shell.openExternal('https://www.yuque.com/xiaowuyaya/serendipity/na2ceo');
        }
      });
  }
}

const dm = registerDm();

/**
 * 在游戏进程中发送消息
 */
export const sendStringInProgress = (msg: string) => {
  try {
    const hwnd1 = dm.findWindow('', 'League of Legends (TM) Client');
    if (!hwnd1) {
      return;
    }
    dm.setWindowState(hwnd1, 1)
    dm.setKeypadDelay('normal', 100);
    dm.keyPress(13);
    dm.sendString(hwnd1, `${msg} 来自：Tik对局助手`);
    dm.keyPress(13);
  } catch (err) {
    console.log(err);
  }
};

export const screenshot = (fileName: string) => {
  try {
    const date = dayjs().format('YYYY-MM-DD');
    const time = dayjs().format('YYYYMMDDHHmmss');
    const savaDir = path.join(app.getPath('userData'), 'screenshot', date);
    createDir(path.join(app.getPath('userData'), 'screenshot'));
    createDir(savaDir);
    const file = path.join(savaDir, `${time}_${fileName}.png`);
    const size = screen.getPrimaryDisplay().workAreaSize
    dm.capturePng(0, 0, size.width, size.height, file);
    return file;
  } catch (err) {
    console.log(err);
  }
}

export const windowKeepTop = (windowTitle: string) => {
  const hwnd1 = dm.findWindow('', windowTitle);
  if (!hwnd1) return
  dm.setWindowState(hwnd1, 8);
}

export const sendSpellsInfo = (spellWindow:BrowserWindow,championName: string, summonerName: string, spellName: string, cooldownBurn: number, curTime: number) => {
  const hwnd1 = dm.findWindow('', 'TIK SPELLS');
  if (!hwnd1) return
  dm.setWindowState(hwnd1, 9);
  spellWindow.hide()
  sendStringInProgress(`${championName}:${summonerName} 已使用 ${spellName}, 技能将在${curTime} 冷却完毕`);
  setTimeout(() => {
    sendStringInProgress(`${championName}:${summonerName} 的 ${spellName}冷却时间还剩 30秒`);
  }, (cooldownBurn - 30) * 1000);
  setTimeout(() => {
    sendStringInProgress(`${championName}:${summonerName} 的 ${spellName}已转好`);
  }, cooldownBurn * 1000);
}

function fsExistsSync(path) {
  try {
    // @ts-ignore
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

function createDir(baseUrl) {
  if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
  }
}
