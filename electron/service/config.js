const { Service, Storage } = require('ee-core');
const _ = require('lodash');
const R = require('../utils/res');

/**
 * 数据持久化
 */
class ConfigService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 查询配置数据
   */
  async getAllConfig() {
    try {
      const db = Storage.JsonDB.connection('config').db;
      const r = db.value();
      return R.success(r);
    } catch (err) {
      this.app.logger.error(`[service:storage] 获取配置文件数据失败:${err}`);
      return R.fail(err);
    }
  }

  /**
   * 通过某字段查询配置文件
   * @param {string} field 列名
   */
  async getConfigByField(field) {
    try {
      const db = Storage.JsonDB.connection('config').db;
      const r = db.get(field).value();
      return R.success(r);
    } catch (err) {
      this.app.logger.error(`[service:storage] 获取配置${field}失败:${err}`);
      return R.fail(err);
    }
  }

  /**
   * 更新配置中某字段的值
   * @param {*} field
   * @param {*} data
   * @returns
   */
  async updateConfigByField(field, data) {
    try {
      const db = Storage.JsonDB.connection('config').db;
      db.set(field, data).write();
      this.app.logger.info(`[service:storage] 更新配置${field}成功`);
      return R.success();
    } catch (err) {
      this.app.logger.error(`[service:storage] 获取配置${field}失败:${err}`);
      return R.success();
    }
  }
}

module.exports = ConfigService;
