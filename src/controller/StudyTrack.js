// Models
const StudyTrack = require('../models/StudyTrack')
const User = require('../models/User')
const Stat = require('../models/Stat')
const Categories = require('../models/Category')
const Activities = require('../models/Activity')

const sequelize = require('../database')

module.exports = {
    async index(req, res) {

        const { idUser } = req.body

        // Validations

        if (!idUser)
            return await res.status(400).json({ error: 'Id is missing' })

        const user = await User.findByPk(idUser)

        if (!user)
            return await res.status(401).json({ error: 'Id invalid' })


        // Query 
        const query = `
            SELECT StudyTracks.id, StudyTracks.name, StudyTracks.description,
                CASE 
                    WHEN StudyTracks.id = 1 THEN "Unlocked"
                    WHEN SUM(CASE WHEN Stats.isCorrect THEN 1 ELSE 0 END) THEN "Unlocked"
                    ELSE "Locked"
                END AS situation
            FROM StudyTracks
            LEFT JOIN Categories ON StudyTracks.id = Categories.StudyTracks_id
            LEFT JOIN Activities ON Categories.id = Activities.Category_id
            LEFT JOIN Stats ON Stats.Activity_id = Activities.id AND Stats.Users_id = ${idUser}
            GROUP BY StudyTracks.id
        `

        const tracks = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        
        return await res.json(tracks)
    },

    async store(req, res) {

        const { name, description } = req.body

        const studyTrack = await StudyTrack.create({ name, description })

        return await res.json({ 
            status: `Track '${studyTrack.name}' was successfully created`
        })

    }
}