const express = require('express')

// Controllers
const StudyTracksController = require('./controller/StudyTrackController')
const AuthController = require('./controller/AuthController')

// Middlewares
const authMiddleware = require('./middleware/auth')

const routes = express.Router()

routes.get('/', (req, res) => {
    return res.json({
        status: 'Beba seu café sem preucupações! por aqui está tudo em dia.'
    })
})

routes.get('/users/:user_id/study-tracks', authMiddleware, StudyTracksController.index)
routes.post('/users/:user_id/study-tracks', StudyTracksController.store)

routes.post('/login', AuthController.login)
routes.post('/register', AuthController.register)

module.exports = routes