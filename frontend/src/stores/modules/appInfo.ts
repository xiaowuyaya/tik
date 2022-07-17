import ipcRenderer from "@/utils/ipcRenderer"
import { defineStore } from "pinia"

interface AppInfo {
  appVersion: string
  macAddr: string
  logDir: string
  lcuEnable: boolean
}

export const useAppInfoStore = defineStore({
  id: 'appInfo',
  state: (): AppInfo => {
    return {
      appVersion: '',
      macAddr: '',
      logDir: '',
      lcuEnable: false
    }
  },
  getters: {},
  actions: {
    load() {
      const { data } = ipcRenderer.sendSync('controller.common.getAppBase', '')
      this.appVersion = data.appVersion
      this.macAddr = data.macAddr
      this.logDir = data.logDir
    }
  }
})