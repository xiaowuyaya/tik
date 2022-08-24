import { appConfig, ddragonConfig, panelData } from '../service/utils/config';
import * as handle from '../service/core/handle'
import * as utils from '../service/utils'

// @ts-ignore (define in dts)
window.appStore = appConfig

// @ts-ignore (define in dts)
window.ddragonStore = ddragonConfig

// @ts-ignore (define in dts)
window.panelDataStore = panelData

// @ts-ignore (define in dts)
window.handle = handle

// @ts-ignore (define in dts)
window.utils = utils

