import { initMain } from "./core/main.init";

async function bootstrap() {
  await initMain()
  await require('./background')
}

bootstrap()