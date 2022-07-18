import { AppSettings, SendSettings, Settings } from "@/types/settings"
import ipcRenderer from "@/utils/ipcRenderer"
import { ElMessage } from "element-plus"
import { defineStore } from "pinia"

export const useSettingsStore = defineStore({
  id: 'settings',
  state: (): Settings => {
    return {
      version: '',
      send: {} as SendSettings,
      app: {} as AppSettings
    }
  },
  getters: {},
  actions: {
    async load() {
      const { code, data, msg } = await ipcRenderer.invoke('controller.settings.getSettings', { type: 'all' })
      if (code === 200) {
        this.version = data.version
        this.send = data.send
        this.app = data.app
      } else {
        ElMessage({
          message: msg,
          type: "error",
          duration: 3 * 1000,
          offset: 50
        });
      }
    },
  }
})