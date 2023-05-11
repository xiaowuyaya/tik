import { defineStore } from 'pinia'
import { addBlacklist, deleteBlacklist, getAllBlacklist } from '../api/blacklist'
import { ElMessage } from 'element-plus'

export const useBlacklistStore = defineStore({
  id: 'blacklist',
  state: () => {
    return {
      list: [],
    }
  },
  getters: {},
  actions: {
    async get() {
      const stateRes = await getAllBlacklist()
      // 同步数据给本地
      $store.blacklistStore.set('list', stateRes.data)
      this.list = stateRes.data
    },
    async add(dto) {
      await addBlacklist(dto)
      const reqRes = await getAllBlacklist()
      if (reqRes.code === 200) ElMessage.success(`拉黑玩家 ${dto.banName} 成功`)
      // 同步数据给本地
      $store.blacklistStore.set('list', reqRes.data)
      this.list = reqRes.data
    },
    async del(dto) {
      await deleteBlacklist(dto)
      const reqRes = await getAllBlacklist()
      // 同步数据给本地
      $store.blacklistStore.set('list', reqRes.data)
      this.list = reqRes.data
    },
  },
})
