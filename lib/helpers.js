//helps the other task

const config = require('./config')
const crypto = require('crypto')
const https = require('https')

let helpers = {}


helpers.parseJsonToObj = (str) => {
  try {
    const obj = JSON.parse(str)
    return obj
  } catch (e) {
    return {}
  }
}

helpers.hash = (str) => {
  if(typeof(str) == 'string' && str.length > 0){
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
    return hash
  } else {
    return false
  }
}

module.exports = helpers
