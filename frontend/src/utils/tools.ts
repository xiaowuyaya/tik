import { Message } from "@arco-design/web-vue"
import useClipboard from "vue-clipboard3"

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
