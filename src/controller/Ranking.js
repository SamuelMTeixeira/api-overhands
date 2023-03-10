
// Models
const User = require('../models/User')
const Stat = require('../models/Stat')
const Activity = require('../models/Activity')
const sequelize = require('../database')

module.exports = {
    async index(req, res) {

        const ranking = await Stat.findAll({
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
                    attributes: ['id', 'name', 'lastname'],
                    required: true,
                }
            ],
            group: ['user.id'],
            order: [
                [sequelize.literal('xp'), 'DESC']
            ]
        })


        return await res.json(ranking)
    }
}