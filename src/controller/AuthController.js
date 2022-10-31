const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')


const generateToken = (id) => {
    return jwt.sign({ id }, authConfig.secret, {
        expiresIn: "15d"
    })
}

module.exports = {
    async login(req, res) {
        const { email, password } = req.body

        const user = await User.findOne({
            where: { email }
        })

        if (!user) {
            return await res.status(400).json({ error: 'Invalid email' })
        }

        if (!await bcrypt.compare(password, user.password)) {
            return await res.status(400).json({ error: 'Invalid password' })
        }

        const token = generateToken(user.id)

        return await res.json({
            token,
            user: {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                idGoogle: user.idGoogle,
                xp: user.xp,
                isAdmin: user.isAdmin,
            }
        })

    },

    async register(req, res) {
        const { name, lastname, email, password } = req.body

        const isUserExists = await User.findOne({
            where: { email }
        })

        if (isUserExists) {
            return await res.status(400).json({ error: 'User already exists' })
        }

        const hash = await bcrypt.hash(password, 10) // Criptografa a senha

        const user = await User.create({ name, lastname, email, password: hash, isAdmin: 0, xp: 0 })

        const token = generateToken(user.id)

        return await res.json({
            token,
            user: {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                idGoogle: user.idGoogle,
                xp: user.xp,
                isAdmin: user.isAdmin,
            }
        })
    },
}