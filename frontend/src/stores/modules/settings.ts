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
          offset: 45
        });
      }
    },
    async syncLocal() {
      const r1 = await ipcRenderer.invoke('controller.settings.updateSettings', { type: 'send', config: JSON.parse(JSON.stringify(this.send)) });      
      const r2 = await ipcRenderer.invoke('controller.settings.updateSettings', { type: 'app', config: JSON.parse(JSON.stringify(this.app)) });
      if(r1.code == 200 && r2.code ==200){
        ElMessage({
          message: `配置成功`,
          type: "success",
          duration: 1 * 1000,
          offset: 0
        });
      }else{
        ElMessage({
          message: `配置失败`,
          type: "error",
          duration: 3 * 1000,
          offset: 45
        });
      }
    }
  }
})