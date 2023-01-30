const Category = require('../models/Category')

module.exports = {
    async index(req, res) {

        const { idStudyTrack } = req.body

        // Validations
        if (!idStudyTrack)
            return await res.status(400).json({ error: 'Id is missing' })

        const allCategories = await Category.findAll({
            attributes: ['name', 'difficulty', 'difficultyOrder'],
            where: { "StudyTracks_id": idStudyTrack },
            order: ['difficultyOrder']
        });

        return await res.json(allCategories)
    },

    async store(req, res) {
        const { name, difficulty, difficultyOrder, idStudyTrack } = req.body

        if (!name || !difficulty || !idStudyTrack)
            return res.status(400).json({ error: 'Important information is missing' })

        const category = await Category.create({ name, difficulty, difficultyOrder, StudyTracks_id: idStudyTrack })

        return await res.json({
            status: `Category '${category.name}' was successfully created`
        })

    }
}