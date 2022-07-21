const winax = require('winax');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Utils } = require('ee-core');
const { dialog, shell } = require('electron');

/* 基于大漠插件实现win32窗口相关hook */

function registerDm() {
  const filePath = path.join(Utils.getExtraResourcesDir(), 'dll', 'dm.dll');
  // 判断文件是否存在
  let isExist = false;
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) isExist = true;
  });

  if (isExist) {
    try {
      return new winax.Object('dm.dmsoft');
    } catch (err) {
      execSync(`regsvr32 ${filePath} /s`);
      return new winax.Object('dm.dmsoft');
    }
  } else {
    dialog
      .showMessageBox({
        type: 'error',
        title: '检测到dm.dll文件不存在',
        message: `请检查 ${filePath} 是否存在？\n 您可以无视这个警告，但是您将无法使用在游戏中发送战绩的功能。`,
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
    dm.keyPress(13);
    dm.sendString(hwnd1, string);
    dm.keyPress(13);
    eeApp.logger.info(`[win32:sendStringInProgress] 向${hwnd1}输出内容成功: ${string}`);
  } catch (err) {
    eeApp.logger.error(`[win32:sendStringInProgress] 发生异常: ${err}`);
  }
}

