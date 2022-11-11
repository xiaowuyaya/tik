import useClipboard from "vue-clipboard3"
import { Message } from "@arco-design/web-vue"
import {shell} from "electron";

export async function copy(str: string) {
  try {
    const { toClipboard } = useClipboard()
    await toClipboard(str)
    Message.success(`复制成功：${str}`)
  } catch (err) {
    Message.error(`复制异常：${err}`)
  }
}