const config = require('../config')
const helpers = require('../helpers')
const _data = require('../data')


let users = {}
users.post = (data, callback) => {
  const _firstname = typeof(data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false
  const _lastname = typeof(data.payload.lastname) == 'string' && data.payload.lastname.trim().length > 0 ? data.payload.lastname.trim() : false
  const _phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false
  const _password  = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
  const _tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false
  const _email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false

  if(_firstname && _lastname && _phone && _password && _tosAgreement && _email){
    callback(200, {_firstname, _lastname, _email, _password, _tosAgreement})
    // _data.read('users', _phone, (err, data) => {
    //   if(err){
    //     const hashPassword = helpers.hash(_password)
    //     if(hashPassword){
    //       const userObj = {
    //         'firstname': _firstname,
    //         'lastname': _lastname,
    //         'phone': _phone,
    //         'tosAgreement': _tosAgreement,
    //         'email': _email,
    //         hashPassword
    //       }
    //       _data.create('users', phone, userObj, (err) => {
    //         if(!err){
    //           callback(200)
    //         }else{
    //           callback(500, {'Error': 'Could not create the new user'})
    //         }
    //       })
    //     }
    //   } else {
    //     callback(400, {'Error' : 'A user with that phone number already exist'})
    //   }
    // })
  } else {
    callback(400, {'Error' : 'Missing required fields @ users', })
  }


}

module.exports = users
