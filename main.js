const Appliaction = require('ee-core').Appliaction
const ElectronStore = require('electron-store')
const { browserConfig } = require('./electron/store/index')

class Main extends Appliaction {
  constructor() {
    super()
    // this === eeApp;
  }

  /**
   * core app have been loaded
   */
  async ready() {
    ElectronStore.initRenderer()
  }

  /**
   * electron app ready
   */
  async electronAppReady() {}

  /**
   * main window have been loaded
   */
  async windowReady() {
    const winOpt = this.config.windowsOption
    if (winOpt.show == false) {
      const win = this.electron.mainWindow
      win.once('ready-to-show', () => {
        win.show()
      })
    }
  }

  /**
   * before app close
   */
  async beforeClose() {
    browserConfig.reset('browserWindows')
  }
}

new Main()
