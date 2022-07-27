const { Appliaction, Storage } = require('ee-core');

class Main extends Appliaction {
  constructor() {
    super();
    // this === eeApp;
  }

  /**
   * core app have been loaded
   */
  async ready() {
    // do some things
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
