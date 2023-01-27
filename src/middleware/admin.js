const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')
const User = require('../models/User')

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader)
        return res.status(401).json({ error: 'Token is missing' })

    const parts = authHeader.split(' ')

    if (!parts === 2)
        return res.status(401).json({ error: 'Token error' })

    const [scheme, token] = parts


    const id = jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' })

        req.userId = decoded.id

        return req.userId
    })

    const user = await User.findByPk(id)

    if (!user.isAdmin)
        return res.status(403).json({ error: 'Access denied' })

    return next()

}