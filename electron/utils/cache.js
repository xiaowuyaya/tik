const Cache = require('cache');
let c = new Cache(24 * 60 * 60 * 1000);

module.exports = c;
