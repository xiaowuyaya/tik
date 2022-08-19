import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      username: "",
      nickName: "xiaowuyaya",
      avatarUrl: "https://tik.lol-tool.com/avatar/default.png",
      email: "",
      phone: "",
      environment: "",
      summonerId: "",
      summonerName: "",
      wxOpenId: ""
    }
  },
  actions: {

  }
})