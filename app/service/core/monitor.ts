import { createClient, createWebSocket } from '../utils/net'
import { app, BrowserWindow } from 'electron'



export const createClientListen = () => {
  const client = createClient()
  if (!client) {
    return
  }
  client.on('disconnect', () => {
    app.quit()
  })
  client.start()
}

export const createWebsocketListen = async (mainWindow: BrowserWindow) => {
  const ws = await createWebSocket();
  console.log(ws);
  if (!ws) return
  // 玩家状态订阅
  ws.subscribe('/lol-gameflow/v1/gameflow-phase', async (data, event) => {
    // 状态转发到渲染进程主窗口
    mainWindow.webContents.send('playerStatus', data);
  });
} 
