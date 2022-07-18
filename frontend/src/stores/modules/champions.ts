import ipcRenderer from "@/utils/ipcRenderer";
import { defineStore } from "pinia"

export const useChampionsStore = defineStore({
  id: 'champions',
  state: (): any => {
    return {
      champions: {}
    }
  },
  actions: {
    async load() {
      this.champions = await ipcRenderer.invoke('controller.data.getDataByField', { dbName: 'champions', field: 'champions' })
    },
  }
})