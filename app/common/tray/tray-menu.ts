import { MenuItemConstructorOptions } from "electron";

export const trayMenus: MenuItemConstructorOptions[] = [
  {
    label: `版本 ${$tools.APP_VERSION}`,
    click: (): void => { }
  },


  { type: 'separator' },

  {
    label: '关于',
    click: (): void => {
    }
  },

  { type: 'separator' },

  { label: '退出', role: 'quit' },
]