const user = require('./users')
const _data = require('../data')
//instance handlers
let handlers = {}

//users handlers method containers
handlers._users = { ...user }

//check of certain methods called
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data, callback)
  } else {
    callback(404)
  }
}

//sample route handler
handlers.sample = (data, callback) => {
  callback(301, {'name': 'sample handler'})
}

//page not found handler
handlers.pageNotFound = (data, callback) => {
  callback(404)
}

module.exports = handlers
