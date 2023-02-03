const express = require('express')

// Controllers
const StudyTracksController = require('./controller/StudyTrack')
const AuthController = require('./controller/Auth')
const CategoryController = require('./controller/Category')
const ActivityController = require('./controller/Activity')

// Middlewares
const authMiddleware = require('./middleware/auth')
const adminMiddleware = require('./middleware/admin')
const multer = require('./middleware/multer')

const routes = express.Router()

routes.get('/', (req, res) => res.json('Beba seu café sem preucupações! por aqui está tudo em dia.'))

// Auth routes
routes.post('/login', AuthController.login)
routes.post('/register', AuthController.register)

// Study tracks routes
routes.get('/study-tracks', authMiddleware, StudyTracksController.index)
routes.post('/study-tracks', adminMiddleware, StudyTracksController.store)

// Category tracks routes
routes.get('/categories', authMiddleware, CategoryController.index)
routes.post('/categories', adminMiddleware, CategoryController.store)

// Category tracks routes
routes.get('/activities', authMiddleware, ActivityController.index)
routes.post('/activities', [adminMiddleware, multer.single('file')], ActivityController.store)

module.exports = routes