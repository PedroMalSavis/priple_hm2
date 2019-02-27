const config = require('../config')
const helpers = require('../helpers')
const _data = require('../data')
const _token = require('./token')


let users = {}
users.post = (data, callback) => {
  const {firstname, lastname, email, phone, password, tosAgreement} = data.payload
  const _firstname = typeof(firstname) == 'string' && firstname.trim().length > 0 ? firstname.trim() : false
  const _lastname = typeof(lastname) == 'string' && lastname.trim().length > 0 ? lastname.trim() : false
  const _phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false
  const _password  = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false
  const _tosAgreement = typeof(tosAgreement) == 'boolean' && tosAgreement == true ? true : false
  const _email = typeof(email) == 'string' && email.trim().length > 0 ? email.trim() : false

  if(_firstname && _lastname && _phone && _password && _tosAgreement && _email){
    _data.read('users', _phone, (err, data) => {
      if(err){
        const hashPassword = helpers.hash(_password)
        if(hashPassword){
          const userObj = {
            'firstname': _firstname,
            'lastname': _lastname,
            'phone': _phone,
            'tosAgreement': _tosAgreement,
            'email': _email,
            'password': hashPassword
          }
          _data.create('users', _phone, userObj, (err) => {
            if(!err){
              callback(200)
            }else{
              callback(500, {'Error': 'Could not create the new user'})
            }
          })
        }
      } else {
        callback(400, {'Error' : 'A user with that phone number already exist'})
      }
    })
  } else {
    callback(400, {'Error' : 'Missing required fields @ users', })
  }
}

users.get = (data, callback) => {
  const {phone} = data.payload
  const {token} = data.headers
  const _phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false
  if(_phone){
    const _token = typeof(token) == 'string' ? token : false
    _token.verifyToken(_token, _phone, (tokenValid) => {
      if(tokenValid){
        _data.read('users', phone, (err, data) => {
          if(!err && data){
            delete data.password
            callback(200)
          }else{
            callback(404)
          }
        })
      } else {
        callback(403, {"Error" : "Missing required token in the header, or it is invalid"})
      }
    })
  } else {
    callback(400, {"Error" : "Missing required fields"})
  }


}

module.exports = users
