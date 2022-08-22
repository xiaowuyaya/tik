const { authenticate,createWebSocketConnection } = require("league-connect")


async function test() {
  const c = await authenticate()
  const r = await createWebSocketConnection(c);
  console.log(r);
}

test()