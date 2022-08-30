const data = require('./champion.json')
const _ = require('lodash')
const fs = require('fs')

let res = {}

_.forIn(data.data, (value, key) => {
  res[value.name] = {
    championId: value.key,
    enName: value.id,
  }
})

fs.writeFileSync('./data.json', JSON.stringify(res), { encoding: 'utf-8' })

