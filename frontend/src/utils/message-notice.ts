import { Message } from '@arco-design/web-vue';

/**
 * 消息通知
 * @param resp 返回结果
 * @param successMsg 成功的提示信息
 * @param successFunc 成功提醒之后执行的方法
 * @param failFunc 失败提醒之后执行的方法
 */
export const useMessage = (resp, successMsg?: string, successFunc = function () { }, failFunc = function () { }) => {
  if (resp.code === 200) {
    Message.success({
      content: successMsg || resp.msg,
      duration: 1500,
    })
    successFunc()
  }
  if (resp.code === 500) {
    Message.error({
      content: `${resp.msg}`,
      duration: 3000,
    })
    failFunc()
  }
}