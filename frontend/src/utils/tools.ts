import { ElMessage } from "element-plus"
import useClipboard from "vue-clipboard3"

/**
 * 复制内容到剪贴板
 * @param {string} str 复制内容
 */
export const copyToClipboard = async (str) => {
  try {
    const { toClipboard } = useClipboard()
    await toClipboard(str)
    ElMessage({
      type: "success",
      message: `复制成功：${str}`,
      duration: 1500,
      offset: 45,
      grouping: true,
    })
  } catch (err) {
    ElMessage({
      type: "error",
      message: `复制过程中发生异常：${err}`,
      duration: 1500,
      offset: 45,
      grouping: true,
    })
  }
}