const admin = {}

//required data: firstname, lastname, password, email, admin,
admin.post = (data, callback) => {
  const {firstname, lastname, password, email, admin} = data.payload
  const _firstname = typeof(firstname) == 'string' && firstname.trim().length > 0 ? firstname.trim() : false
  const _lastname = typeof(lastname) == 'string' && lastname.trim().length > 0 ? lastname.trim() : false
  const _password = typeof(password) == 'string' && password.trim().length > 0 ? password.trim() : false
  const _email = typeof(email) == 'string' && email.trim().length > 0 ? email.trim() : false
  const _admin = typeof(admin) == 'boolean' admin == true ? true : false
 }
module.exports = admin
