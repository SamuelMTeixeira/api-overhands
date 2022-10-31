const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = {
    async index(req, res) {
        const users = await User.findAll()

        return await res.json(users)
    },

    async store(req, res) {
        const { name, lastname, email, password } = req.body

        const hash = await bcrypt.hash(password, 10) // Criptografa a senha

        const user = await User.create({ name, lastname, email, password: hash, isAdmin: 0, xp: 0 })

        return await res.json({
            name,
            lastname,
            email,
        })
    }
}