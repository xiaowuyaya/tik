import { addBlacklist, CreatBlacklist, getAllBlacklist } from "@/api/blacklist"
import ipcRenderer from "@/utils/ipcRenderer"
import { useMessage } from '@/utils/message-notice'
import { defineStore } from "pinia"


export const useBlacklistStore = defineStore({
  id: 'blacklist',
  state: () => {
    return {
      list: []
    }
  },
  getters: {},
  actions: {
    async getAll() {
      const stateRes = await getAllBlacklist()
      // 同步数据给本地
      const res = await ipcRenderer.invoke('controller.data.updateDataByField', { dbName: 'blacklist', field: 'list', data: stateRes.data })
      useMessage(res, '获取黑名单数据成功')
      this.list = stateRes.data
    },
    async add(dto: CreatBlacklist) {
      await addBlacklist(dto)
      const reqRes = await getAllBlacklist()
      const res = await ipcRenderer.invoke('controller.data.updateDataByField', { dbName: 'blacklist', field: 'list', data: reqRes.data })
      this.list = reqRes.data
      useMessage(res, '添加黑名单信息成功')
    }
  }
})