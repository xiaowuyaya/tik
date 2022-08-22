import { createHttp2Request, createHttpSession, createWebSocketConnection, LeagueClient } from '../league-connect'
import { appConfig } from './config'


/* websocket */
export const createWebSocket = async () => {
  try {
    const credentials = appConfig.get<any>('credentials');
    return await createWebSocketConnection(credentials);
  } catch (err) {}
};



/* client listen */
export const createClient = () => {
  try {
    const credentials = appConfig.get<any>('credentials');
    return new LeagueClient(credentials, {
      pollInterval: 1000, // Check every second
    });
  } catch (err) { }
};

// lcu http2 request
export const http2Request = async (url: string, method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET', postData?: any) => {
  const credentials = appConfig.get<any>('credentials');
  const session = await createHttpSession(credentials)
  const response = await createHttp2Request({
    method,
    url
  }, session, credentials)
  // Remember to close the session when done
  session.close()
  return response.json<any>()
};
