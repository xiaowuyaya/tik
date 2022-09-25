import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";


const appStore = useAppStore()
const userStore = useUserStore();

export const mainSetup = async() => {
  /* 如果用户信息不存在 重新获取 */
  if (!userStore.username) {
    userStore.myInfo({
      mac: appStore.mac,
      clientVersion: appStore.version,
    });
  }
}