import { login } from "@/api/user";
import { setToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";

interface UserInfo {
  username: string;
  nickName: string;
  avatarUrl: string;
  email: string;
  phone: string;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserInfo => {
    return {
      username: "",
      nickName: "",
      avatarUrl: "",
      email: "",
      phone: "",
    }
  },
  getters: {},
  actions: {
    async doLogin(loginForm) {
      const res = await login(loginForm);
      const { token,  userinfo } = res.data;
      this.username = userinfo.username
      this.nickName = userinfo.nickName
      this.avatarUrl = userinfo.avatarUrl
      this.email = userinfo.email
      this.phone = userinfo.phone
      ElMessage({
        message: "登入成功",
        type: "success",
        duration: 3 * 1000,
      });
      setToken(token);
    }
  }
})