import NodeCache from 'node-cache'
const cache = new NodeCache({ deleteOnExpire: false })
export default cache
