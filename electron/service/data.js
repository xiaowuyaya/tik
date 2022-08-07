const { Service, Storage } = require('ee-core');
const c = require('../utils/cache')
const R = require('../utils/res');

/**
 * 数据持久化
 */
class DataService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * 查询配置数据
   */
  async getAllData(dbName) {
    try {
      const db = Storage.JsonDB.connection(dbName).db;
      const r = db.value();
      return r
    } catch (err) {
      this.app.logger.error(`[service:storage] 获取配置文件数据失败:${err}`);
      return R.fail(null,err);
    }
  }

  /**
   * 通过某字段查询配置文件
   * @param {string} field 列名
   */
  async getDataByField(dbName, field) {
    try {
      const db = Storage.JsonDB.connection(dbName).db;
      const r = db.get(field).value();
      return r
    } catch (err) {
      this.app.logger.error(`[service:storage] 获取配置${field}失败:${err}`);
      return R.fail(null,err);
    }
  }

  /**
   * 更新配置中某字段的值
   * @param {*} field
   * @param {*} data
   * @returns
   */
  async updateDataByField(dbName, field, data) {
    try {
      const db = Storage.JsonDB.connection(dbName).db;
      db.set(field, data).write();
      this.app.logger.info(`[service:storage] 更新配置${field}成功`);
      return R.success();
    } catch (err) {
      this.app.logger.error(`[service:storage] 获取配置${field}失败:${err}`);
      return R.fail(null,err);
    }
  }

  getCacheData(key) {
    try{
      const r = c.get(key)
      this.app.logger.info(`[service:storage] 获取缓存${key}成功`);
      return R.success(JSON.parse(JSON.stringify(r)))
    }catch(err) {
      this.app.logger.error(`[service:storage] 获取缓存${fikeyeld}失败:${err}`);
    }
  }
}

module.exports = DataService;
