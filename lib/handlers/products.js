const _data = require('../data')
const helpers = require('../helpers')
const Token = require('./token')
const product = {}

//create new product
//data-input: name = stirng, price = string,   ingredients = object, token = string
//data-output: name, date, price, status, date, isArchive
product.post = (data, callback) => {
  const {name, price, ingredients} = data.payload
  const {token} = data.headers
  const _name = typeof(name) == 'string' && name.trim().length > 0 ? name.trim() : false
  const _price = typeof(price) == 'string' && price.trim().length > 0 ? price.trim() : false
  const _ingredients = typeof(ingredients) == 'object' && ingredients.length > 0 ? ingredients : false
  const _token = typeof(token) == 'string' ? token : false
  if(_token){
    if(_name && _price && _ingredients ){
      _data.read('tokens', _token, (err, tokenData) => {
        if(!err && tokenData){
          const userphone = tokenData.phone
          Token.verifyToken(_token, userphone, (verified) => {
            if(verified){
              _data.read('users', userphone, (err, userData) => {
                if(!err && userData){
                  const {admin} = userData
                  if(admin){
                    const newProd = {
                      'name' : _name,
                      'price': _price,
                      'ingredients' : _ingredients,
                      'createdBy': userphone,
                      'status': 'true',
                      'isArchive': false,
                      'date': helpers.todayDateToString
                    }
                    _data.create('products', _name, newProd, (err) => {
                      if(!err){
                        callback(200)
                      }else{
                        callback(500, {'Error': 'Could not create new product'})
                      }
                    })
                  }else{
                    callback(400, {'Error':'User is not admin, please enter as admin'})
                  }
                }else{
                  callback(400, {'Error': 'User does not exist'})
                }
              })
            }else{
              callback(400, {'Error': 'Token has expired'})
            }
          })
        }else{
          callback(400, {'Error': 'Invalid token'})
        }
      })
    }else{
      callback(400, {'Error':'Missing required field(s)'})
    }
  }else{
    callback(400, {'Error': 'Missing token'})
  }

}

product.get = (data, callback) => {
  _data.list('products', (err, listed) => {
    if(!err && listed){
      callback(200, listed)
    }else{
      callback(500, {'Error': 'Missing list'})
    }
  })
}

product.put = (data, callback) => {
  const {name, price, ingredients, status} = data.payload
  const {token} = data.headers
  const _name = typeof(name) == 'string' && name.trim().length > 0 ? name.trim() : false
  const _price = typeof(price) == 'string' && price.trim().length > 0 ? price.trim() : false
  const _ingredients = typeof(ingredients) == 'object' && ingredients.length > 0 ? ingredients : false
  const _status = typeof(status) == 'string' && status.trim().length > 0  ? status.trim() : false
  const _token = typeof(token) == 'string' ? token : false
  if(_token){
    if(_name || _ingredients || _price || status){
      _data.read('tokens', _token, (err, tokenData) => {
        if(!err && tokenData){
          const {phone} = tokenData
          Token.verifyToken(_token, phone, (verified) => {
            if(verified){
              _data.read('users', phone, (err, userData) => {
                if(!err && userData){
                  if(userData.admin){
                    _data.read('products', _name, (err, productData) => {
                      if(!err && productData){
                        if(_price)
                          productData.price = _price
                        if(_ingredients)
                          productData.ingredients = _ingredients
                        if(_status)
                          productData.status = _status
                          _data.update('products', _name, productData, (err) => {
                            if(!err){
                              callback(200)
                            }else{
                              callback(500, {'Error': 'Could not update product info'})
                            }
                          })
                      }else{
                        callback(400, {'Error': "Product does not exist"})
                      }
                    })
                  }else{
                    callback(400, {'Error': 'User is not admin, please enter as admin'})
                  }
                }else{
                  callback(400, {'Error': 'Invalid user'})
                }
              })
            }else{
              callback(400, {'Error': 'Token has expired'})
            }
          })
        }else{
          callback(400, {'Error': 'Invalid token'})
        }
      })
    }else{
      callback(400, {'Error': 'Missing required field(s)'})
    }
  }else{
    callback(400, {'Error': 'Missing token'})
  }
}

product.delete = (data, callback) => {
  const {name} = data.payload
  const {token} = data.headers

  const _name = typeof(name) == 'string' && name.trim().length > 0 ? name.trim() : false
  const _token = typeof(token) == 'string' ? token : false

  if(_token){
    if(_name){
      _data.read('tokens', _token, (err, tokenData) => {
        if(!err && tokenData){
          const {phone} = tokenData
          Token.verifyToken(_token, phone, (verified) => {
            if(verified){
              _data.read('users', phone, (err, userData) => {
                if(!err && userData){
                  const {admin} = userData
                    if(admin){
                      _data.read('products', _name, (err, productData) => {
                        if(!err && productData){
                          productData.isArchive = true
                          _data.update('products', _name, (err) => {
                            if(!err){
                              callback(200)
                            }else{
                              callback(500, {'Error': 'Could not update products'})
                            }
                          })
                        }else{
                        callback(400, {'Error': 'Coould not find product'})
                        }
                      })
                    }else{
                      callback(400, {'Error': 'User is not admin, plaese enter as admin'})
                    }
                }else{
                  callback(400, {'Error': 'User is invalid'})
                }
              })
            }else{
            callback(400, {'Error': 'Token has expired'})
            }
          })
        }else{
        callback(400, {'Error': 'Invalid Token'})
        }
      })
    }else{
      callback(400, {'Error': 'Missing required field'})
    }
  }else{
    callback(400, {'Error': 'Missing token'})
  }

}



module.exports = product
