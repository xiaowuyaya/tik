const { Appliaction, Storage, Utils } = require('ee-core');
const path = require('path')

class Main extends Appliaction {
  constructor() {
    super();
    // this === eeApp;
  }

  /**
   * core app have been loaded
   */
  async ready() {
    // 初始化荣誉截图文件夹
    Utils.mkdir(path.join(Utils.getAppUserDataDir(), 'game_screenshot'), 'game_screenshot');
    this.logger.info(`[main] game_screenshot目录已创建`);
  }

  /**
   * electron app ready
   */
  async electronAppReady() {
    // do some things
  }

  /**
   * main window have been loaded
   */
  async windowReady() {
    // do some things
  }

  /**
   * before app close
   */
  async beforeClose() {
    // do some things
    // 清空opgg buildId
    const db = Storage.JsonDB.connection('ddragon').db;
    db.set('opgg', '').write();
  }
}

new Main();
