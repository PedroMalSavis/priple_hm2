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

//update file using fs
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if(!err && fileDescriptor){
      const stringData = JSON.stringify(data)
      fs.truncate(fileDescriptor, (err) => {
        if(!err){
          fs.writeFile(fileDescriptor, (err) => {
            if(!err){
              fs.close(fileDescriptor, (err) => {
                if(!err){
                  callback(false)
                } else {
                  callback('Error closing existing file')
                }
              })
            } else {
              callback('Error in writing to the existing file')
            }
          })
        } else {
          callback('Error truncating files')
        }
      })
    } else {
      callback('Could not open file for updating, it may not exist yet')
    }
  })
}
//delete file using fs
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
    callback(err)
  })
}

//listing file using fs
lib.list = (dir, callback) => {
  fs.readdir(`${lib.baseDir}${dir}/`, (err, data) => {
    if(!err && data && data.length > 0){
      let trimmedFiles = []
      data.forEach((fileName) => {
        trimmedFiles.push(fileName.replace('.json', ''))
      })
      callback(false, trimmedFiles)
    } else {
      callback(err, data)
    }
  })
}

module.exports = lib
