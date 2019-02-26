const config = require('../.config')
const helpers = require('../.helpers')
const _data = require('../.data')


let users = {}
users.post = (data, callback) => {
  const {firstname, lastname, phone, password, tosAgreement, email} = data.payload
  const _firstname = typeof(firstname) == 'string' && firstname.trim().length > 0 ? firstname.trim() : false
  const _lastname = typeof(lastname) == 'string' && lastname.trim().length > 0 ? lastname.trim() : false
  const _phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false
  const _password  = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false
  const _tosAgreement = typeof(tosAgreement) == 'boolean' && tosAgreement == true ? true : false
  const _email = typeof(email) == 'string' && email.trim().length > 0 ? email.trim() : false

  if(_firstname && _lastname && _phone && _password && _tosAgreement && _email) {
    _data.read('users', _phone, (err, data) => {
      if(err){
        const hashPassword = helpers.hash(_password)
        if(hashPassword){
          const userObj = {
            'firstname': _firstname,
            'lastname': _lastname,
            'phone': _phone,
            'tosAgreement': _tosAgreement,
            'email': _email
            hashPassword
          }
          _data.create('users', phone, userObj, (err) => {
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
    callback(400, {'Error' : 'Missing required fields'})
  }


}

module.exports = users
