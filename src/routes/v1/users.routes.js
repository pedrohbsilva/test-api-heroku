const express = require('express')
const usersRoutes = express.Router()
const userController = require('../../controllers/userController')
const multer = require('multer')
const upload = multer()

usersRoutes.get('/users', userController.index)
usersRoutes.get('/user/:id', userController.indexOne)
usersRoutes.get('/randomUser', userController.getExternalApi)
usersRoutes.get('/getUserByFilter', userController.getByFilter)
usersRoutes.post('/user', userController.create)
usersRoutes.post('/users', upload.single('file'), userController.importUsers)
usersRoutes.post('/newUsers', userController.createUserWithExternalApi)
usersRoutes.patch('/user/:id', userController.updateOne)
usersRoutes.delete('/user/:id', userController.deleteOne)

module.exports = usersRoutes