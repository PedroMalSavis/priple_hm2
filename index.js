const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder


const server = http.createServer((req,res) => {
  //instance for data, headers, and method handling
  const parseURL = url.parse(req.url, true)
  const path = parseURL.pathname
  const trimpath = path.replace(/^\/+|\/+$/g, '')
  const queryStringObj = parseURL.query
  const method = req.method.toLowerCase()
  const headers = req.headers
  const decoder = new StringDecoder('utf-8')

  //instance for handling body-data
  let buffer = ''

  //request for data
  req.on('data', (data) => {
    buffer += decoder.write(data)
  })

  //request for end
  req.on('end', () => {
    buffer += decoder.end()
    const chosenHandler = typeof(router[trimpath]) !== 'undefined' ? router[trimpath] : handlers.pageNotFound
    const data = {
      trimpath,
      method,
      queryStringObj,
      headers,
      'payload': buffer
    }

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200
      payload = typeof(payload) == 'object' ? payload : {}
      const payloadString = JSON.stringify(payload)
      res.setHeader('Content-type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
      console.log('return this response', statusCode, payloadString)
    })
  })
})
server.listen(3000, () => {
  console.log('this protocol is listening to port 3000')
})



//instance for hadling the routers
let handlers = {}
handlers.sample = (data, callback) => {
  callback(301, {'name': 'sample handler'})
}
handlers.pageNotFound = (data, callback) => {
  callback(404)
}
//instance for router object
const router = {
  'sample': handlers.sample
}
