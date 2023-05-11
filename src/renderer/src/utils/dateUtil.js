import dayjs from 'dayjs'

dayjs.locale('zh-cn')
dayjs.extend(require('dayjs/plugin/relativeTime'))
dayjs.extend(require('dayjs/plugin/duration'))

export default dayjs
