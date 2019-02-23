
//making a dev mode and production mode
const environments = {}

//object for dev mode
environments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging'
}

//object for production mode
environments.production = {
  'httpPort': 6000,
  'httpsPort': 6001,
  'envName': 'production'
}

//lets know the env used in the commmand line
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging

module.exports = environmentToExport
