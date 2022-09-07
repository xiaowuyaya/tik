import { useConfigStore } from './config';
import { getMyInfo, login, LoginClientUserDto, MyInfoDto, updateUserInfo } from "@/api/user";
import { add, CreateEnvironmentDto } from '@/api/environment'
import { removeToken, setToken } from "@/utils/auth";
import { Message, Modal } from '@arco-design/web-vue';
import { defineStore } from "pinia";
import {vipCheck} from "@/api/vip";
import dayjs from "dayjs";

const configStore = useConfigStore()

interface UserInfo {
  username: string;
  nickName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  environment: string;
  summonerId: string;
  summonerName: string;
  wxOpenId: string
  expiration: string
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
      environment: "",
      summonerId: "",
      summonerName: "",
      wxOpenId: "",
      expiration: "",
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
      this.wxOpenId = userinfo.wxOpenId
      Message.success({
        content: '登入成功，正在加载中',
        duration: 3 * 1000,
      })
      setToken(token);
    },
    logout() {
      Modal.error({
        title: '退出账号',
        content:
          '是否确定退出当前账号？',
        closable: true,
        okText: '确定',
        cancelText: '取消',
        simple: true,
        hideCancel: false,
        async onOk() {
          removeToken()
          window.location.reload();
        },
        onClose() { }
      });
    },
    async myInfo(data: MyInfoDto) {
      const res = await getMyInfo(data);
      this.username = res.data.username
      this.nickName = res.data.nickName
      this.avatarUrl = res.data.avatarUrl
      this.email = res.data.email
      this.phone = res.data.phone
      this.wxOpenId = res.data.wxOpenId
      Message.success({
        content: `欢迎回来：${this.nickName}`,
        duration: 3 * 1000,
      })
    },
    async registerEnvironment() {
      const data: CreateEnvironmentDto = {
        summonerName: this.summonerName,
        environment: this.environment,
        summonerId: this.summonerId,
      }
      await add(data)
    },
    async updateUser() {
      await updateUserInfo({
        nickName: this.nickName,
        email: this.email,
        phone: this.phone,
      })
    },
  }
})