const _data = require('../data')
const helpers = require('../helpers')
let token = {}

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
    _data.read('users', _phone, (err, userdata) => {
      if(!err && userdata){
        const hashPassword = helpers.hash(_password)
        //check if password is valid
        if(hashPassword == userdata.password){
          const tokenID = helpers.createRandomStirng(20)
          const expires = Date.now() + 1000 * 60 * 60
          const tokenObj = {
            'phone': _phone,
            'id': tokenID,
            expires
          }
          _data.create('tokens', tokenObj.id, tokenObj, (err) => {
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

token.put = (data, callback) => {
  const {id, extend} = data.payload
  const _id = typeof(id) == 'string' && id.trim().length == 20 ? id.trim() : false
  const _extend = typeof(extend) == 'boolean' && extend == true ? true : false
  if(_id && _extend){
    _data.read('tokens', _id, (err, tokendata) => {
      if(!err && tokendata) {
        if(tokendata.expires > Date.now()){
          tokendata.expires = Date.now() + 1000 * 60 * 60
          _data.update('tokens', _id, tokendata, (err) => {
            if(!err){
              callback(200)
            } else {
              callback(500, {'Error': "Could not update the token\'s expiration"})
            }
          })
        } else {
          callback(400, {'Error': 'token has already expired, could not extend'})
        }
      } else {
        callback(400, {'Error': 'specified user does not exist'})
      }
    })
  }else{
    callback(400, {'Error': 'Missing required field(s) or it is invalid'})
  }
}

token.delete = (data, callback) => {
  const {id} = data.queryStringObj
  const _id = typeof(id) == 'string' && id.trim().length == 20 ? id.trim() : false
  if(_id){
    _data.read('tokens', _id, (err, tokenData) => {
      if(!err, tokenData){
        _data.delete('tokens', _id, (err) => {
          if(!err){
            callback(200)
          } else {
            callback(500, {'Error': 'Could not delete specific token'})
          }
        })
      }else{
        callback(400, {'Error': 'Could not find specific token'})
      }
    })
  }else{
    callback(400, {'Error': "Missing required field"})
  }
}

module.exports = token
