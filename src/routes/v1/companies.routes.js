const express = require('express')
const companiesRoutes = express.Router()
const companyController = require('../../controllers/companyController')

companiesRoutes.get('/companies', companyController.index)
companiesRoutes.get('/company/:id', companyController.indexOne)
companiesRoutes.post('/companies', companyController.create)
companiesRoutes.patch('/company/:id', companyController.update)

module.exports = companiesRoutes