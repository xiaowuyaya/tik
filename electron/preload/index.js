'use strict'
const initialize = require('../library/initialize')
const autoUpdater = require('../library/autoUpdater')
const tray = require('../library/tray')

/**
 * 预加载模块入口
 * @param {Object} app - 全局app对象
 */
module.exports = async app => {
  await initialize.install(app)
  autoUpdater.install(app)
  tray.install(app)
}
