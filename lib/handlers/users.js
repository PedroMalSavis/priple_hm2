const config = require('../config')
const helpers = require('../helpers')
const _data = require('../data')
const Token = require('./token')


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
  const _token = typeof(token) == 'string' ? token : false
  if(_phone){
    Token.verifyToken(_token, _phone, (tokenValid) => {
      if(tokenValid){
        _data.read('users', _phone, (err, data) => {
          if(!err && data){
            delete data.password
            callback(200, data)
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

users.put = (data, callback) => {
  const {phone, firstname, lastname, password, email} = data.payload
  const {token} = data.headers
  const _phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false
  const _firstname = typeof(firstname) == 'string'&& firstname.trim().length > 0 ? firstname.trim() : false
  const _lastname = typeof(lastname) == 'string' && lastname.trim().length > 0 ? lastname.trim() : false
  const _password = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false
  const _email = typeof(email) == 'strin' && email.trim().length > 0 ? email.trim() : false
  //valid phone
  if(_phone){
    //check for input fields for update
    if(_firstname || _lastname || _password || email){

      const _token = typeof(token) == 'string' ? token : false
      Token.verifyToken(_token, _phone, (tokenValid) => {
        if(tokenValid){
          _data.read('users', _phone, (err, userData) => {
            if(!err && userData) {
              //update user data
              if(_firstname)
                userData.firstname = _firstname
              if(_lastname)
                userData.lastname = _lastname
              if(_password)
                userData.password = helpers.hash(_password)
              if(_email)
                userData.email = _email

              _data.update('users', _phone, userData, (err) => {
                if(!err){
                  callback(200)
                } else {
                  callback(500, {'Error': 'Could not update the user'})
                }
              })
            } else {
              callback(400, {'Error': 'user does not exist'})
            }
          })
        } else {
          callback(400, {'Error': 'token is unacceptable, try again'})
        }
      })
    } else {
      callback(400, {'Error':'Missing field(s) to update'})
    }
  } else {
    callback(400, {'Error': "Missing required field(s)"})
  }
}

module.exports = users
