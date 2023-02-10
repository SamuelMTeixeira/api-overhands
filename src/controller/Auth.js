const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

// Models
const User = require('../models/User')
const sequelize = require('../database')

const generateToken = (id) => jwt.sign({ id }, authConfig.secret, {
    expiresIn: "15d"
})

module.exports = {
    async login(req, res) {
        const { email, password } = req.body

        const user = await User.findOne({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ error: 'Invalid email' })
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = generateToken(user.id)

        const queryXP = `
            SELECT CASE WHEN SUM(a.xp) IS NULL THEN 0 ELSE FLOOR(SUM(a.xp)) END AS xp
            FROM Users u
            INNER JOIN Stats s ON s.Users_id = u.id
            INNER JOIN Activities a ON a.id = s.Activity_id
            WHERE u.id = ${user.id} AND s.isCorrect = true`

        // Get XP user
        const getXp = await sequelize.query(queryXP, { type: sequelize.QueryTypes.SELECT })

        return await res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                situation: user.situation,
                birth: user.birth,
                gender: user.gender,
                xp: getXp[0].xp
            }
        })

    },

    async register(req, res) {
        const { name, lastname, email, password, situation, gender, birth } = req.body

        const isUserExists = await User.findOne({
            where: { email }
        })

        if (isUserExists) {
            return await res.status(400).json({ error: 'User already exists' })
        }

        const hash = await bcrypt.hash(password, 10) // Criptografa a senha

        const user = await User.create({ name, lastname, email, password: hash, gender, birth, situation, isAdmin: 0 })

        const token = generateToken(user.id)

        const queryXP = `
            SELECT CASE WHEN SUM(a.xp) IS NULL THEN 0 ELSE FLOOR(SUM(a.xp)) END AS xp
            FROM Users u
            INNER JOIN Stats s ON s.Users_id = u.id
            INNER JOIN Activities a ON a.id = s.Activity_id
            WHERE u.id = ${user.id} AND s.isCorrect = true

        `
        // Get XP user
        const getXp = await sequelize.query(queryXP, { type: sequelize.QueryTypes.SELECT })

        return await res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                gender: user.gender,
                birth: user.birth,
                xp: getXp[0].xp,
            }
        })
    },
}