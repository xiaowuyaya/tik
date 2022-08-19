import { BrowserWindow, ipcMain, app } from 'electron';

export const createMainWindowIpcListen = (mainWindow: BrowserWindow) => {
  // 关闭窗口
  ipcMain.on('mainWin.close', ()=> {
    app.quit()
  })

  // 最小化窗口
  ipcMain.on('mainWin.minisize', ()=> {
    mainWindow.minimize()
  })
}