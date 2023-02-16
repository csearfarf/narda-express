const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.js'] // since our folder lifecycle is using controller->routes->index

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index.js')
})