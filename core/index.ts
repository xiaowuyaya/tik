
import { app } from "electron";
import { join } from "path";
import { initMain } from "./main.init";

async function bootstrap() {

  await initMain()
  await require('./background')
}

bootstrap()