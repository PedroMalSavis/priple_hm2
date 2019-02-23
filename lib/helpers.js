//helps the other task

const config = require('./config')
const crypto = require('crypto')
const https = require('https')
const querrystring = require('querrystring')

let helpers = {}


helpers.parseJsonToObj = (str) => {
  try {
    const obj = JSON.parse(str)
  } catch (e) {
    return {}
  }
}


module.exports = helpers
