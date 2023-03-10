const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')

// Models
const User = require('../models/User')
const Stat = require('../models/Stat')
const Activity = require('../models/Activity')
const sequelize = require('../database')

module.exports = {
    async login(req, res) {
        const { email, password } = req.body

        const getUser = await Stat.findOne({
            where: { isCorrect: true },
            attributes: [
                [sequelize.fn('SUM', sequelize.col('xp')), 'xp'],
            ],
            include: [
                {
                    model: Activity,
                    as: 'activities',
                    attributes: [],
                    required: true,
                }, {
                    model: User,
                    as: 'user',
                    where: { email },
                    required: true,
                }
            ],
            group: ['user.id']
        })

        if (!getUser) {
            return res.status(400).json({ error: 'Invalid email or password' })
        }

        if (!(await bcrypt.compare(password, getUser.user.password))) {
            return res.status(400).json({ error: "Invalid email or password" })
        }

        return await res.json({
            token: generateToken(getUser.user.id),
            user: {
                id: getUser.user.id,
                name: getUser.user.name,
                lastname: getUser.user.lastname,
                email: getUser.user.email,
                birth: getUser.user.birth,
                gender: getUser.user.gender,
                xp: getUser.toJSON().xp
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