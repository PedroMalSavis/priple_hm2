const user = require('./users')
//instance handlers
let handlers = {}


//check of certain methods called
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if(acceptableMethods.indexOf(data.method) > -1){
    user[data.method](data, callback)
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
