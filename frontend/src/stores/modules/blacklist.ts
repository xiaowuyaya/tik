import { pageBlacklist } from "@/api/blacklist"
import { Blacklist } from "@/types/blacklist"
import { defineStore } from "pinia"
import { useUserStore } from "./user"

const userStore = useUserStore()

export const useBlacklistStore = defineStore({
  id: 'blacklist',
  state: (): Blacklist[] => {
    return []
  },
  getters: {},
  actions: {
    async getAll(filter?: string) { 
      const r = await pageBlacklist({
        environment: userStore.environment,
        summonerId: userStore.summonerId,
        filter,
        page: 1,
        limit: 999
      })
      console.log(r);
      
    }
  }
})