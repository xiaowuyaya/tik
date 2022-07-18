import { getMyInfo, login, LoginClientUserDto, MyInfoDto } from "@/api/user";
import { UserInfo } from "@/types/user";
import { setToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import { defineStore } from "pinia";

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
    async doLogin(loginForm: LoginClientUserDto) {
      const res = await login(loginForm);
      const { token, userinfo } = res.data;
      this.username = userinfo.username
      this.nickName = userinfo.nickName
      this.avatarUrl = userinfo.avatarUrl
      this.email = userinfo.email
      this.phone = userinfo.phone
      ElMessage({
        message: "登入成功",
        type: "success",
        duration: 3 * 1000,
        offset: 50
      });
      setToken(token);
    },
    async myInfo(data: MyInfoDto) {
      const res = await getMyInfo(data);
      this.username = res.data.username
      this.nickName = res.data.nickName
      this.avatarUrl = res.data.avatarUrl
      this.email = res.data.email
      this.phone = res.data.phone
      ElMessage({
        message: `欢迎回来：${this.nickName}`,
        type: "success",
        duration: 3 * 1000,
        offset: 50
      });
    }
  }
})