const helpers = require('../helpers')
const _data = require('../data')
const Token = require('./token')
const admin = {}

//required data: firstname, lastname, password, email, admin,
admin.post = (data, callback) => {
  const {firstname, lastname, password, email, admin, phone} = data.payload
  const _firstname = typeof(firstname) == 'string' && firstname.trim().length > 0 ? firstname.trim() : false
  const _lastname = typeof(lastname) == 'string' && lastname.trim().length > 0 ? lastname.trim() : false
  const _password = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false
  const _email = typeof(email) == 'string' && email.trim().length > 0 ? email.trim() : false
  const _admin = typeof(admin) == 'boolean' && admin == true ? true : false
  const _phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false

  if(_firstname && _lastname && _password && _email && _admin){
    _data.read('users', _phone, (err, userdata) => {
      if(err){
        const hashPassword = helpers.hash(_password)
        const dataObj = {
          'firstname' : _firstname,
          'lastname' : _lastname,
          'password': hashPassword,
          'phone' : _phone,
          'admin': _admin,
          'email': _email
        }
        _data.create('users', _phone, dataObj, (err) => {
          if(!err){
            callback(200)
          }else{
            callback(500, {'Error':'Could not create new user'})
          }
        })
      }else{
        callback(400, {'Error': 'specific user already exist'})
      }
    })
  } else {
    callback(400, {'Error': 'Missing required field(s)'})
  }

 }

 admin.get = (data, callback) => {
   const {phone} = data.payload
   const {token} = data.headers
   const _phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false
   const _token = typeof(token) == 'string' ? token : false

   if(_phone){
     Token.verifyToken(_token, _phone, (verified) => {
       if(verified){
         _data.read('users', _phone, (err, userData) => {
           if(!err && userData){
             delete userData.password
             callback(200, userData)
           }else{
             callback(404)
           }
         })
       }else{
         callback(400, {'Error': 'token does not exist'})
       }
     })
   } else {
     callback(400, {'Error': 'Missing required field(s)'})
   }
 }
module.exports = admin
