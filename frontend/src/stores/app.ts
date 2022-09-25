import { defineStore } from 'pinia'
import ipcRenderer from '@/utils/ipcRenderer'

export const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      version: '',
      mac: '',
      logDir: '',
      configDir: '',
    }
  },
  actions: {
    async init() {
      const appConfig = await ipcRenderer.invoke('controller.common.appConfig', {})
      this.version = appConfig.version
      this.mac = appConfig.mac
      this.logDir = appConfig.logDir
      this.configDir = appConfig.configDir
    },
  },
})
