const user = require('./users')
const token = require('./token')
const admin = require('./admin')
//instance handlers
let handlers = {}

handlers.admins = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put']
  if(acceptableMethods.indexOf(data.method) > -1){
    admin[data.method](data, callback)
  } else {
    callback(404)
  }
}
//check of certain methods called
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1){
    user[data.method](data, callback)
  } else {
    callback(404)
  }
}
handlers.tokens = (data, callback) => {
  const acceptableMethods = ['post', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1){
    token[data.method](data, callback)
  } else {
    callback(405)
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
