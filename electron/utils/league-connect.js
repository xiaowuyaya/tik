const { createWebSocketConnection, createHttp1Request, createHttp2Request, createHttpSession, LeagueClient } = require('league-connect');
const req = require('superagent');
const c = require('../utils/cache');
/**
 * https://github.com/matsjla/league-connect
 */
// const credentials = c.get('credentials')

/* websocket */
exports.getWs = async () => {
  try {
    const credentials = c.get('credentials');
    return await createWebSocketConnection(credentials);
  } catch (err) {}
};

/* client listen */
exports.getClient = () => {
  try {
    const credentials = c.get('credentials');
    return new LeagueClient(credentials, {
      pollInterval: 1000, // Check every second
    });
  } catch (err) {}
};

// superagent request
exports.request = async (method, url) => {
  try {
    const credentials = c.get('credentials');
    const r = await req(method, url).ca(credentials.certificate);
    return r.body;
  } catch (err) {
    return null;
  }
};

exports.http2Request = async (url, method = 'GET', postData = null) => {
  try {
    const credentials = c.get('credentials');
    const resp = await req(method, `https://127.0.0.1:${credentials.port}${url}`)
      .auth('riot', credentials.password) // 认证
      .send(postData) //post请求参数
      .ca(credentials.certificate) // tls证书
      .http2(); // 开启http2
    return resp.body;
  } catch (e) {
    return e;
  }
};

/* 该模块无效，bug在RC4版本修复了，但是需要ESM模块，该项目无法升级 */
// /* http1 */
// exports.http1Request = async (url, method = 'GET') => {
//   const credentials = c.get('credentials');
//   try {
//     const resp = await createHttp1Request(
//       {
//         method,
//         url,
//       },
//       credentials,
//     );
//     return resp.json();
//   } catch (err) {
//     return null;
//   }
// };

// /* http2 */
// exports.http2Request = async (
//   url,
//   method = 'GET',
//   data = null,
//   jsontify = true,
// ) => {
//   const credentials = c.get('credentials');
//   try {
//     const session = await createHttpSession(credentials);
//     const resp = await createHttp2Request(
//       {
//         method,
//         url,
//         body: data,
//       },
//       session,
//       credentials,
//     );
//     session.close();
//     if (jsontify) {
//       return resp.json();
//     }
//     return resp;
//   } catch (err) {
//     return null;
//   }
// };
