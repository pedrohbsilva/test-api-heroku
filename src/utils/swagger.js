const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})
const outputFile  = './src/swagger_output.json';

const endpointsFiles = ['./src/server.js'];
    
const doc = {
    info: {
    title: 'My API',
    description: 'Description',
    },
    servers: [
        {
          url: 'http://localhost:3333/',
          description: 'Development server',
          templates: {
            scheme: {
              enum: ['http', 'https'],
              default: 'https',
            },
          },
        }
      ]
};

swaggerAutogen(outputFile , endpointsFiles, doc)
