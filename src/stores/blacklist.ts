import { addBlacklist, CreatBlacklist, deleteBlacklist, DeleteBlacklist, getAllBlacklist } from "@/api/blacklist"
import { defineStore } from "pinia"

const blacklistStore = window.blacklistStore


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
      blacklistStore.set('blacklist', stateRes.data)
      this.list = stateRes.data
    },
    async add(dto: CreatBlacklist) {
      await addBlacklist(dto)
      const reqRes = await getAllBlacklist()
      // 同步数据给本地
      blacklistStore.set('blacklist', reqRes.data)
      this.list = reqRes.data
    },
    async delete(dto: DeleteBlacklist) {
      await deleteBlacklist(dto)
      const reqRes = await getAllBlacklist()
      // 同步数据给本地
      blacklistStore.set('blacklist', reqRes.data)
      this.list = reqRes.data
    }
  }
})