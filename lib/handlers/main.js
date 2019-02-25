let handlers = {}
const user = require('./users')

handlers.user = {...user}

handlers.sample = (data, callback) => {
  callback(301, {'name': 'sample handler'})
}
handlers.pageNotFound = (data, callback) => {
  callback(404)
}

module.exports = handlers
