const electronApp = require("electron").app
const getMac = require('getmac').default
const { Service, Utils } = require("ee-core")

/**
 * 通用业务模块
 */
class CommonService extends Service {
  constructor(ctx) {
    super(ctx)
  }

  /**
   * 获取当前应用版本
   */
  getAppVersion () {
    return electronApp.getVersion()
  }


  /**
   * 获取机器码
   */
  getMacAddr () {
    return getMac()
  }

  /**
   * 获取日志目录
   */
  getLogDir () {
    return Utils.getLogDir()
  }

  /**
   * 主窗口最小化
   */
  mainWMinisize() {
    this.app.electron.mainWindow.minimize()
  }

  /**
   * 退出处理
   * @param {*} type  0：退出程序， 1：关闭窗口
   */
  handleQuit(type) {
    if(type === 0) {
      this.app.appQuit()
      return
    }

    this.app.electron.mainWindow.close()
  }


}

module.exports = CommonService