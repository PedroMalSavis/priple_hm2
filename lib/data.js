const path = require('path')
const fs = require('fs')
const helpers = require('./helpers')

let lib = {}

//base directory in data
lib.baseDir = path.join(__dirname, '/../.data')

//create new file using fs
lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor){
      const stringData = JSON.stringify(data)
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if(!err){
          fs.close(fileDescriptor, (err) => {
            if(!err){
              callback(false)
            } else {
              callback('Error in closing file')
            }
          })
        } else {
          callback('Error writing to new files')
        }
      })
    } else {
      callback('Could not create new file, it may already exist')
    }
  })
}

//read file using fs

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
    if(!err && data){
      const parsedata = helpers.parseJsonToObj(data)
    } else {
      callback(err, data)
    }
  })
}
