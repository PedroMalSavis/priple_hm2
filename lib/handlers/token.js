const token = {}
const _data = require('../data')
const helpers = require('../helpers')

token.verifyToken = (id, phone, callback) => {
  _data.read('tokens', id, (err, tokendata) => {
    if(!err && tokendata){
      if(tokendata.phone == phone && tokendata.expires > Date.now()){
        callback(true)
      } else {
        callback(false)
      }
    }else{
      callback(false)
    }
  })
}

token.post = (data, callback) => {
  const {phone, password} = data.payload
  const _phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false
  const _password = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false
  //verify if inputs are valid
  if(_phone && _password){
    _data.read('users', phone, (err, userdata) => {
      if(!err && userdata){
        const hashPassword = helpers.hash(_password)
        //check if password is valid
        if(hashPassword === userdata.password){
          const tokenID = helpers.createRandomStirng(20)
          const expires = Date.now() + 1000 * 60 * 60
          const tokenObj = {
            'phone': _phone,
            'id': tokenID,
            expires
          }
          console.log({...tokenObj})
          _data.create('tokens', tokenID, tokenObj, (err) => {
            if(!err){
              callback(200, tokenObj)
            } else {
              callback(500, {"Error" : "Could not create new token for user"})
            }
          })
        }else {
          callback(400, {'Error': "User Password does not exist"})
        }
      } else {
        callback(400, {"Error" : "User does not exist"})
      }
    })
  } else {
    callback(400, {'Error': "Missing required field(s)"})
  }
}


module.exports = token
