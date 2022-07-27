const { Service, Storage } = require("ee-core")
const { BrowserWindow } = require('electron')

/**
 * opgg 服务
 */
class OpggService extends Service {
  constructor(ctx) {
    super(ctx)
  }

  /**
 * 显示英雄数据工具窗口
 */
  async showChampionToolWindow (args) {
    const championsDB = Storage.JsonDB.connection("champions").db
    const windowId = championsDB.get('championToolWindowId').value()
    const championToolWindow = BrowserWindow.fromId(windowId)

    if (!args.show) {
      championToolWindow.hide()
      return 0
    }

    // 转发参数
    championToolWindow.webContents.send("controller.opgg.listenChampionChange", args)
    // 显示窗口
    championToolWindow.show()
    return 0
  }
}

module.exports = OpggService