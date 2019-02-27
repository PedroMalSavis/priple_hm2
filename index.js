const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const fs = require('fs')
const handlers = require('./lib/handlers/main')
const helpers = require('./lib/helpers')
//const _data = require('./lib/data')
//lets divide the house: [dev mode : staging, production : production]
const config = require('./lib/config.js')


//call the heavens in https and http

//http
const httpServer = http.createServer((req, res) => {
  unisonserver(req,res)
})
httpServer.listen(config.httpPort, () => {
  console.log(`the HTTP server is running and up at the port: ${config.httpPort}`)
})

//https
const httpsOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsOptions, (req, res) => {
  unisonserver(req, res)
})
httpsServer.listen(config.httpsPort, () => {
  console.log(`the HTTPS server is running and up at the port: ${config.httpsPort}`)
})

//the heavens
const unisonserver = (req,res) => {
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
      'payload': helpers.parseJsonToObj(buffer)
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
}



//instance for hadling the routers

//instance for router object
const router = {
  'sample': handlers.sample,
  'users' : handlers.users
}
