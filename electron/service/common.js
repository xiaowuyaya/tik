const electronApp = require('electron').app;
const { screen } = require('electron');
const getMac = require('getmac').default;
const { Service, Utils } = require('ee-core');
const fs = require('fs');
const path = require('path');

/**
 * 通用业务模块
 */
class CommonService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 获取当前应用版本
   */
  getAppVersion() {
    return electronApp.getVersion();
  }

  /**
   * 获取机器码
   */
  getMacAddr() {
    return getMac();
  }

  /**
   * 获取日志目录
   */
  getLogDir() {
    return Utils.getLogDir();
  }

  /**
   * 获取用户数据路径
   */
  getConfigDir() {
    return Utils.getAppUserDataDir();
  }

  /**
   * 获取屏幕大小
   */
  getScreenSize() {
    return {
      width: screen.getPrimaryDisplay().workAreaSize.width,
      height: screen.getPrimaryDisplay().workAreaSize.height,
    };
  }

  /**
   * 主窗口最小化
   */
  mainWMinisize() {
    this.app.electron.mainWindow.minimize();
  }

  /**
   * 退出处理
   * @param {*} type  0：退出程序， 1：关闭窗口
   */
  handleQuit(type) {
    if (type == 0) {
      this.app.appQuit();
      return;
    }
    this.app.electron.mainWindow.close();
  }

  /**
   * 获取英雄时刻图片列表
   */
  getAllHeroScreenshot() {
    const BASE_URI = path.join(Utils.getAppUserDataDir(), 'game_screenshot');
    const dateDir = fs.readdirSync(BASE_URI);
    let res = []
    for (var i = 0; i < dateDir.length; i++) {
      const imgs = fs.readdirSync(path.join(BASE_URI, dateDir[i]));
      for (var j = 0; j < imgs.length; j++) {
        res.push(path.join(BASE_URI, dateDir[i], imgs[j]))
      }
    }
    return res
  }
}

module.exports = CommonService;
