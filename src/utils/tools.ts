import useClipboard from "vue-clipboard3"
import { Message } from "@arco-design/web-vue"
import _ from 'lodash'

export async function copy(str: string) {
  try {
    const { toClipboard } = useClipboard()
    await toClipboard(str)
    Message.success(`复制成功：${str}`)
  } catch (err) {
    Message.error(`复制异常：${err}`)
  }
}

/**
 * 多排检测
 * @param {*} checkArr
 * [{summonerName: "", gameIds: []}]
 */
export function checkTogether(checkArr: any[]) {
  let arr1 = []
  let arr2 = []

  for (let i = 0; i < checkArr.length; i++) {
    for (let j = 0; j < checkArr.length; j++) {
      if (j <= i) continue
      const jiaoji = _.intersection(checkArr[i].gameIds, checkArr[j].gameIds)
      if (jiaoji.length >= 2) {
        // 说明是组队的
        // 只有当两个人都不在组队1时 才能将其放入
        if (!arr1.includes(checkArr[i].summonerName) && !arr1.includes(checkArr[j].summonerName)) {
          // 判断组队1有几个元素
          if (arr1.length == 0) {
            if (!arr1.includes(checkArr[i].summonerName)) {
              arr1.push(checkArr[i].summonerName)
            }
            if (!arr1.includes(checkArr[j].summonerName)) {
              arr1.push(checkArr[j].summonerName)
            }
          } else {
            if (!arr2.includes(checkArr[i].summonerName)) {
              arr2.push(checkArr[i].summonerName)
            }
            if (!arr2.includes(checkArr[j].summonerName)) {
              arr2.push(checkArr[j].summonerName)
            }
          }
        }
        if (arr1.includes(checkArr[i].summonerName) || arr1.includes(checkArr[j].summonerName)) {
          if (!arr1.includes(checkArr[i].summonerName)) {
            arr1.push(checkArr[i].summonerName)
          }
          if (!arr1.includes(checkArr[j].summonerName)) {
            arr1.push(checkArr[j].summonerName)
          }
        }
      }
    }
  }

  if (arr1.length == 1) arr1 = []
  if (arr2.length == 1) arr2 = []

  return { arr1, arr2 }
}