'use strict';
const chromeExtension = require('../library/chromeExtension')

/**
 * 预加载模块入口
 * @param {Object} app - 全局app对象
 */
module.exports = async (app) => {

  // chrome拓展
  chromeExtension.install()

}
