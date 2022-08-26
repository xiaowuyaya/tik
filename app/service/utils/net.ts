import { createHttp2Request, createHttpSession, createWebSocketConnection, LeagueClient } from '../league-connect'
import request from 'superagent'
import { appConfig } from './config'
import log from './log'

const logger = log.scope('net')

/* websocket */
export const createWebSocket = async () => {
  try {
    const credentials = appConfig.get<any>('credentials');
    return await createWebSocketConnection(credentials);
  } catch (err) {
    logger.error(`create websocket throw an error: ${err}`)
   }
};



/* client listen */
export const createClient = () => {
  try {
    const credentials = appConfig.get<any>('credentials');
    return new LeagueClient(credentials, {
      pollInterval: 1000, // Check every second
    });
  } catch (err) { 
    logger.error(`create game client listen throw an error: ${err}`)
  }
};

// lcu http2 request
export const http2Request = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET', postData?: any) => {
  try {
    const credentials = appConfig.get<any>('credentials');
    const session = await createHttpSession(credentials)
    const response = await createHttp2Request({
      method,
      url,
      body: postData
    }, session, credentials)
    // Remember to close the session when done
    session.close()
    return response.json<any>()
  } catch (err) { 
    return null
   }
};

// superagent request
export const superagentRequest = async (url: string, method = 'GET') => {
  try {
    const credentials = appConfig.get<any>('credentials');
    const r = await request(method, url).ca(credentials.certificate);
    return r.body;
  } catch (err) {
    return null;
  }
};

// superagent request
export const superagentHttp2Request = async (url: string, method = 'GET', data?: any) => {
  try {
    const credentials = appConfig.get<any>('credentials');
    const r = await request(method, `https://127.0.0.1:${credentials.port}${url}`)
      .auth('riot', credentials.password) // 认证
      .send(data) //post请求参数
      .ca(credentials.certificate) // tls证书
      .http2(); // 开启http2
    return r.body;
  } catch (err) {
    return null;
  }
};