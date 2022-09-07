/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'loadsh'
declare interface Window {
  appStore: any,
  ddragonStore: any
  panelDataStore: any
  blacklistStore: any
  credentialsConfig: any
  handle: any,
  utils: any
  lcuApi: any
  cache: any
}

declare module "*.json" {
  const jsonValue: any;
  export default jsonValue;
}

declare module 'ws'