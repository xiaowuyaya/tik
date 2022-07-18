const { Controller } = require('ee-core');

class DataController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  async getAllData(args, event) {
    return await this.service.data.getAllData(args.dbName);
  }

  async getDataByField(args, event) {
    return await this.service.data.getDataByField(args.dbName, args.field);
  }

  async updateDataByField(args, event) {
    return await this.service.data.updateDataByField(args.dbName, args.field, args.data);
  }
}

module.exports = DataController;
