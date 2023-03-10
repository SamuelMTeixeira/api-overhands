const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

// Models
const User = require('../models/User')
const sequelize = require('../database')

module.exports = {
    async login(req, res) {
        const { email, password } = req.body

        const user = await User.findOne({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid password" })
        }

        const xp = await getXp({
            where: { email: user.email }
        })

        return await res.json({
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                birth: user.birth,
                gender: user.gender,
                xp
            }
        })
    },

    async register(req, res) {
        const { name, lastname, email, password, situation, gender, birth } = req.body

        const hash = await bcrypt.hash(password, 10) // Criptografa a senha

        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: { name, lastname, email, password: hash, gender, birth, situation, isAdmin: false },
        })

        if (!created) {
            return res.status(400).json({ error: 'User already exists' })
        }

        return await res.json({
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                birth: user.birth,
                gender: user.gender,
                xp: "0"
            }
        })

    }

}

// Functions
const generateToken = (id) => jwt.sign({ id }, authConfig.secret, {
    expiresIn: "15d"
})


const getXp = async ({ where = { email: '' } }) => {

    const { email } = where

    const query = `
    SELECT CASE WHEN COUNT(a.xp) = 0 THEN 0 ELSE SUM(a.xp) END AS xp
    FROM Users u
    INNER JOIN Stats s ON s.Users_id = u.id AND u.email LIKE '${email}'
    INNER JOIN Activities a ON a.id = s.Activity_id
    WHERE s.isCorrect = true
    `
    // Get XP user
    const response = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })

    return response[0].xp
}