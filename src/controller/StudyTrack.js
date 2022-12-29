const StudyTrack = require('../models/StudyTrack')

module.exports = {
    async index(req, res) {

        const studyTracks = await StudyTrack.findAll({
            attributes: ['name', 'description']
        });

        return await res.json(studyTracks)
    },

    async store(req, res) {

        const { name, description } = req.body

        const studyTrack = await StudyTrack.create({ name, description })

        return await res.json({
            name: studyTrack.name,
            description: studyTrack.description
        })

    }
}