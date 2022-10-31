const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader)
        return res.status(401).json({ error: 'Token is missing' })

    const parts = authHeader.split(' ')

    if (!parts === 2)
        return res.status(401).json({ error: 'Token error' })


    const [scheme, token] = parts


    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).json({error: 'Invalid token'})

      //  req.userId = decoded.id
     //   console.log('SEU ID É '+ req.userId)
        return next()
    })

}