const express = require('express')

// Controllers
const StudyTracksController = require('./controller/StudyTrack')
const AuthController = require('./controller/Auth')
const CategoryController = require('./controller/Category')

// Middlewares
const authMiddleware = require('./middleware/auth')
const adminMiddleware = require('./middleware/admin')

const routes = express.Router()

routes.get('/', (req, res) => res.json('Beba seu café sem preucupações! por aqui está tudo em dia.'))

// Study tracks routes
routes.get('/study-tracks', authMiddleware, StudyTracksController.index)
routes.post('/study-tracks', adminMiddleware, StudyTracksController.store)

// Auth routes
routes.post('/login', AuthController.login)
routes.post('/register', AuthController.register)

// Category tracks routes
routes.get('/categories', authMiddleware, CategoryController.index)
routes.post('/register', authMiddleware, CategoryController.index)

module.exports = routes