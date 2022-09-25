const { appConfig, ddragonConfig, blacklistConfig } = require('../store/index')
const utils = require('../utils/index')
const electron = require('electron')

window.appStore = appConfig

window.ddragonStore = ddragonConfig

window.blacklistStore = blacklistConfig

window.electron = electron

window.utils = utils
