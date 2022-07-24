import useClipboard from "vue-clipboard3"
import ipcRenderer from "./ipcRenderer"
import { Message } from '@arco-design/web-vue';

/**
 * 复制内容到剪贴板
 * @param {string} str 复制内容
 */
export const copyToClipboard = async (str) => {
  try {
    const { toClipboard } = useClipboard()
    await toClipboard(str)
    Message.success({
      content: `复制成功：${str}`,
      duration: 1500,
    })

  } catch (err) {
    Message.error({
      content: `复制过程中发生异常：${err}`,
      duration: 3000,
    })
  }
}

/**
 * 在浏览器中打开连接
 * @param {string} url 链接
 */
export const openUrl = async (url) => {
  await ipcRenderer.invoke('controller.common.openUrlInBrower', { url })
}

/**
 * 打开目录地址
 * @param {string} path 地址
 */
export const openPath = async (path) => {
  await ipcRenderer.invoke('controller.common.openDirPath', { path })
}