import { addBlacklist, CreatBlacklist, getAllBlacklist } from "@/api/blacklist"
import { Blacklist } from "@/types/blacklist"
import ipcRenderer from "@/utils/ipcRenderer"
import { ElMessage } from "element-plus"
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
      const r = await getAllBlacklist()
      // 同步数据给本地
      await ipcRenderer.invoke('controller.data.updateDataByField', { dbName: 'blacklist', field: 'list', data: r.data })
      ElMessage({
        message: `获取黑名单数据成功`,
        type: "success",
        duration: 3 * 1000,
        offset: 45
      });
      this.list = r.data
    },
    async add(dto: CreatBlacklist) {
      await addBlacklist(dto)
      const r = await getAllBlacklist()
      await ipcRenderer.invoke('controller.data.updateDataByField', { dbName: 'blacklist', field: 'list', data: r.data })
      this.list = r.data
      ElMessage({
        message: `添加黑名单信息成功`,
        type: "success",
        duration: 3 * 1000,
        offset: 45
      });
    }
  }
})