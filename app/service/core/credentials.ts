import { BrowserWindow } from 'electron';
import { authenticate, AuthenticationOptions, Credentials } from "league-connect";
import { createClientListen, createWebsocketListen } from "./monitor";
import { appConfig } from "../utils/config";

export const createCredentialsService = async (mainWindow: BrowserWindow) => {
  let credentials: Credentials | null = null;
  
  try {
    let authenticationOptions: AuthenticationOptions[] = [
      {
        windowsShell: 'cmd',
        useDeprecatedWmic: true,
      },
      {
        windowsShell: 'powershell',
        useDeprecatedWmic: false,
      },
    ];
    try {
      credentials = await authenticate(authenticationOptions[0]);
    } catch (error) {
      // 部分win7以上电脑没有wimc，采用pws方式获取凭证
      credentials = await authenticate(authenticationOptions[1]);
    }
  } catch (err) { }

  appConfig.set('credentials', credentials)

  if (credentials) {
    createClientListen()
    await createWebsocketListen(mainWindow)
  }
}