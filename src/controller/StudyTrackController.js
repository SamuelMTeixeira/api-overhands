const StudyTrack = require('../models/StudyTrack')
const User = require('../models/User')

module.exports = {
    async index(req, res) {
        const { user_id } = req.params

        const user = await User.findByPk(user_id, {
            include: { association: 'StudyTracks' }
        })

        if(!user){
            return await res.status(400).json({error: 'User not found'})
        }

        return await res.json(user)
    },

    async store(req, res) {
        const { user_id } = req.params

        const { name, description } = req.body

        const user = await User.findByPk(user_id)

        if(!user){
            return await res.status(400).json({error: 'User not found'})
        }
        
        const studyTrack = await StudyTrack.create({  name, description, idProfile: user_id  })

        return await res.json(studyTrack)

    }
}