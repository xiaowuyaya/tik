const { ipcRenderer: ipc } = window.require && window.require('electron') || {}

/**
 * 发送异步消息（invoke/handle 模型）
 * @param channel
 * @param param
 * @returns {Promise}
 */
const invoke = (channel, param) => {
  return ipc.invoke(channel, param)
}


/**
 * 发送同步消息（send/on 模型）
 * @param channel
 * @param param
 * @returns {Any}
 */
const sendSync = (channel, param) => {
  const message = ipc.sendSync(channel, param)
  return message
}

export default {
  ipc,
  invoke,
  sendSync
}