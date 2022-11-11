
import { addBlacklist, CreatBlacklist, deleteBlacklist, DeleteBlacklist, getAllBlacklist } from '@/api/blacklist'
import { defineStore } from 'pinia'
import { Message } from '@arco-design/web-vue'

export const useBlacklistStore = defineStore({
  id: 'blacklist',
  state: () => {
    return {
      list: [],
    }
  },
  getters: {},
  actions: {
    async getAll() {
      const stateRes = await getAllBlacklist()
      // 同步数据给本地
      $store.blacklistStore.set('blacklist',stateRes.data)
      this.list = stateRes.data
    },
    async add(dto: CreatBlacklist) {
      await addBlacklist(dto)
      const reqRes: any = await getAllBlacklist()
      if (reqRes.code == 200) {
        Message.success({
          content: `拉黑玩家 ${dto.banName} 成功`,
        })
      }
      // 同步数据给本地
      $store.blacklistStore.set('blacklist', reqRes.data)
      this.list = reqRes.data
    },
    async delete(dto: DeleteBlacklist) {
      await deleteBlacklist(dto)
      const reqRes = await getAllBlacklist()
      // 同步数据给本地
      $store.blacklistStore.set('blacklist', reqRes.data)
      this.list = reqRes.data
    },
  },
})
