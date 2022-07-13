const { Controller } = require('ee-core')
const R = require('../utils/res')

class CommonController extends Controller {
  constructor(ctx) {
    super(ctx)
  }

  /**
   * 获取应用基本信息
   */
  getAppBase (args, event) {
    const { getAppVersion, getMacAddr, getLogDir, getConfigDir } = this.service.common
    const data = {
      appVersion: getAppVersion(),
      macAddr: getMacAddr(),
      logDir: getLogDir(),
    }
    return R.success(data)
  }

  /**
   * 窗口处理
   */
  handleWindow (args, event) {
    //  btn 0：最小化 1：退出
    // quitType 退出方式 0：退出程序， 1：关闭窗口
    const { btn, quitType } = args
    if (btn === 0) {
      this.service.common.mainWMinisize()
    }
    if (btn === 1) {
      this.service.common.handleQuit(quitType)
    }
    return R.success()
  }
}

module.exports = CommonController