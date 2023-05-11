import { defineStore } from 'pinia'
import * as userApi from '../api/user'
import * as envApi from '../api/environment'
import { ElMessage, ElMessageBox } from 'element-plus'
import {setToken, removeToken, getToken} from '../utils/auth'
import { checkVipConfirmStatus } from '../api/vip'
import router from '../router'
import { getClientUserConfig, syncClientUserConfig } from '../api/user'
import dayjs from '../utils/dateUtil'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      username: '',
      userId: '',
      nickName: '',
      avatarUrl: '',
      email: '',
      phone: '',
      environment: '',
      summonerId: '',
      summonerName: '',
      wxOpenId: '',
      vipConfirmStatus: -1,
      expiration: '',
    }
  },
  actions: {
    async login(formData) {
      const res = await userApi.login(formData)
      const { token, userinfo } = res.data

      this.userId = userinfo.userId
      this.username = userinfo.username
      this.nickName = userinfo.nickName
      this.avatarUrl = userinfo.avatarUrl
      this.email = userinfo.email
      this.phone = userinfo.phone
      this.wxOpenId = userinfo.wxOpenId

      ElMessage({
        message: `你好呀，${userinfo.nickName}`,
        grouping: true,
        center: true,
        type: 'success',
      })
      setToken(token)
    },
    logout() {
      ElMessageBox.confirm(`是否确定退出当前登入的TikLeagueTool账号：@${this.username}`, '退出登入', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          removeToken()
          router.push('/')
        })
        .catch(() => {})
    },
    async currentUserInfo(data) {
      const res = await userApi.getMyUserInfo(data)
      this.username = res.data.username
      this.userId = res.data.userId
      this.nickName = res.data.nickName
      this.avatarUrl = res.data.avatarUrl
      this.email = res.data.email
      this.phone = res.data.phone
      this.wxOpenId = res.data.wxOpenId
    },
    async registerEnvironment() {
      await envApi.addEnvironment({
        summonerName: this.summonerName,
        environment: this.environment,
        summonerId: this.summonerId,
      })
    },
    async updateUserInfo() {
      await userApi.updateUserInfo({
        nickName: this.nickName,
        email: this.email,
        phone: this.phone,
      })
    },
    async checkVipConfirmStatus() {
      // 获取Vip菜单显示状态
      const checkVipConfirmStatusResp = await checkVipConfirmStatus()
      this.vipConfirmStatus = checkVipConfirmStatusResp.data
    },
    async syncConfigServer() {
      const data = $store.appConfigStore.store
      if (data) await syncClientUserConfig({ config: JSON.stringify(data) })
    },
    async syncConfigLocal() {
      const { data } = await getClientUserConfig()
      if (data) {
        $store.appConfigStore.set(JSON.parse(data.config))
        ElMessage.success({ content: `已加载到服务端配置, 上次同步时间: ${dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss')}`, duration: 5 })
      }
    },
    async syncUserConfig() {
      if (getToken()) {
        $log.info(`正在同步用户配置${this.username}上云`)
        const config = $store.appConfigStore.get('app')
        if (config) await syncClientUserConfig({ config: JSON.stringify(config) })
      }
    },
  },
})
