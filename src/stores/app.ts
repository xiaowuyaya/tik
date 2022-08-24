import getmac from 'getmac';
import { defineStore } from "pinia";
import pkg from '../../package.json';

export const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      version:pkg.version,
      mac: getmac(),
      logDir: '',
      configDir: '',
    }
  },
  actions: {

  }
})