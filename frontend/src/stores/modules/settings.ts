import { AppSettings, SendSettings, Settings } from "@/types/settings"
import ipcRenderer from "@/utils/ipcRenderer"
import { useMessage } from '@/utils/message-notice'
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
      const res = await ipcRenderer.invoke('controller.settings.getSettings', { type: 'all' })
      if (res.code === 200) {
        this.version = res.data.version
        this.send = res.data.send
        this.app = res.data.app
      } else {
        useMessage(res)
      }
    },
    async syncLocal() {
      const r1 = await ipcRenderer.invoke('controller.settings.updateSettings', { type: 'send', config: JSON.parse(JSON.stringify(this.send)) });      
      const r2 = await ipcRenderer.invoke('controller.settings.updateSettings', { type: 'app', config: JSON.parse(JSON.stringify(this.app)) });
      if(r1.code == 200 && r2.code ==200){
        useMessage(r1, '配置成功')
      }else{
        useMessage(r1)
      }
    }
  }
})