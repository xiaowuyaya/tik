import { BrowserWindow } from 'electron';
import { authenticate, AuthenticationOptions, Credentials } from "../league-connect";
import { createClientListen, createWebsocketListen } from "./monitor";
import {appConfig, credentialsConfig} from "../utils/config";
import * as api from './api'
import log from '../utils/log';

const logger = log.scope('credentials')

export const createCredentialsService = async (mainWindow: BrowserWindow, championRuneWindow: BrowserWindow, spellsWindow: BrowserWindow) => {
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
    logger.info(`get credentials success, addr: https://riot:${credentials.password}@127.0.0.1:${credentials.port}`)

  } catch (err) {
    logger.error(`get credentials throw an error: ${err}`)
   }

  credentialsConfig.set('credentials', credentials)

  if (credentials) {
    createClientListen()
    await createWebsocketListen(mainWindow,championRuneWindow, spellsWindow)
  }

  await api.sendNotifications('Tik🎮', 'Tik英雄联盟对局助手已启动！💕');
}