const express = require('express')

// Controllers
const StudyTracksController = require('./controller/StudyTrackController')
const AuthController = require('./controller/AuthController')

// Middlewares
const authMiddleware = require('./middleware/auth')
const adminMiddleware = require('./middleware/admin')

const routes = express.Router()

routes.get('/', (req, res) => {
    return res.json('Beba seu café sem preucupações! por aqui está tudo em dia.')
})

routes.get('/study-tracks', authMiddleware, StudyTracksController.index)
routes.post('/study-tracks', adminMiddleware, StudyTracksController.store)

routes.post('/login', AuthController.login)
routes.post('/register', AuthController.register)

module.exports = routes