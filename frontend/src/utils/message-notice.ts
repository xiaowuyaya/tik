import { ElMessage } from "element-plus";

/**
 * 消息通知
 * @param resp 返回结果
 * @param successMsg 成功的提示信息
 * @param successFunc 成功提醒之后执行的方法
 * @param failFunc 失败提醒之后执行的方法
 */
export const useMessage = (resp, successMsg?: string, successFunc = function () { }, failFunc = function () { }) => {
  if (resp.code === 200) {
    ElMessage({
      type: "success",
      message: successMsg || resp.msg,
      duration: 1500,
      offset: 45,
      center: true,
      grouping: true,
    })
    successFunc()
  }
  if (resp.code === 500) {
    ElMessage({
      type: "error",
      message: `${resp.msg}`,
      duration: 3000,
      offset: 45,
      center: true,
      grouping: true,
    })
    failFunc()
  }
}