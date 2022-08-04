const winax = require('winax');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Utils } = require('ee-core');
const { dialog, shell } = require('electron');
const dayjs = require('dayjs');

/* 基于大漠插件实现win32窗口相关hook */

function registerDm() {
  const filePath = path.join(Utils.getExtraResourcesDir(), 'dll', 'dm.dll');  // 添加双引号 以防出现 Program Files 自带空格问题
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
exports.sendStringInProgress = (eeApp, string) => {
  try {
    const hwnd1 = dm.findWindow('', 'League of Legends (TM) Client');
    if (!hwnd1) {
      eeApp.logger.error('[win32:sendStringInProgress] 未找到游戏窗口');
      return;
    }
    dm.setWindowState(hwnd1, 1)
    dm.setKeypadDelay('normal', 100);
    dm.keyPress(13);
    dm.sendString(hwnd1, `${string} 来自：Tik对局助手`);
    dm.keyPress(13);
    eeApp.logger.info(`[win32:sendStringInProgress] 向${hwnd1}输出内容成功: ${string}`);
  } catch (err) {
    eeApp.logger.error(`[win32:sendStringInProgress] 发生异常: ${err}`);
  }
};

/**
 * 游戏截图
 * @param {*} eeApp
 * @param {*} type
 * @returns
 */
exports.gameScreenshot = (eeApp, type) => {
  try {
    const date = dayjs().format('YYYY-MM-DD');
    const time = dayjs().format('YYYYMMDDHHmmss');
    const savaDir = path.join(Utils.getAppUserDataDir(), 'game_screenshot', date);
    createDir(path.join(Utils.getAppUserDataDir(), 'game_screenshot'));
    createDir(savaDir);
    eeApp.logger.info(`[win32:gameScreenshot] 开始截图，存放路径: ${savaDir}`);
    const file = path.join(savaDir, `${time}_${type}.png`);
    const { width, height } = eeApp.service.common.getScreenSize();
    dm.capturePng(0, 0, width, height, file);
    this.sendStringInProgress(eeApp, `${type}, 荣誉截图已保存!`);
    return file;
  } catch (err) {
    eeApp.logger.error(`[win32:gameScreenshot] 发生异常: ${err}`);
  }
};

exports.windowKeepTop = (eeApp, winTitle) => {
  const hwnd1 = dm.findWindow('', winTitle);
  if (!hwnd1) {
    eeApp.logger.error(`[win32:windowKeepTop] 未找到窗口：${winTitle}`);
    return;
  }
  dm.setWindowState(hwnd1, 8);
};

exports.sendSpellsInfo = () => {
  const hwnd1 = dm.findWindow('', 'TIK SPELLS');
  if (!hwnd1) {
    eeApp.logger.error(`[win32:sendSpellsInfo] 未找到窗口：${winTitle}`);
    return;
  }
  // 取消置顶
  dm.setWindowState(hwnd1, 9);
};

function fsExistsSync(path) {
  try {
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
