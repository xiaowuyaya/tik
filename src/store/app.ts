
import { defineStore } from 'pinia'
import {getToken} from "@/utils/auth";
// @ts-ignore
import _ from 'loadsh'

export const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      NEED_LOGIN: true,
      championsStore : []
    }
  },
  getters: {},
  actions:{
    init(){
      const token = getToken()
      this.NEED_LOGIN = !token;

      const championsData = $store.ddragonStore.get('ddragon.champions')
      // @ts-ignore
      _.forIn(championsData, (v, k) => {
        const data: any = {}
        data.value = v.championId
        data.label = k
        // @ts-ignore
        this.championsStore.push(data)
      })
    }
  }
})
