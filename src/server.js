const express = require('express');
const app = express()
const routes = require('./routes')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(routes);

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log('Executando'))


