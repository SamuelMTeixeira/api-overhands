const Category = require('../models/Category')

module.exports = {
    async index(req, res) {

        const { idStudyTrack } = req.body

        // Validations

        if (!idStudyTrack)
            return await res.status(400).json({ error: 'Id is missing' })

        const allCategories = await Category.findAll({
            attributes: ['name', 'image', 'difficulty', 'difficultyOrder'],
            where: { "StudyTracks_id": idStudyTrack },
            order: ['difficultyOrder']
        });

        return await res.json(allCategories)
    },

    async store(req, res) {
        const { name, image, difficulty, difficultyOrder, idStudyTrack } = req.body

        const category = await Category.create({ name, image, difficulty, difficultyOrder, StudyTracks_id: idStudyTrack })

        return await res.json({
            name: category.name,
            image: category.image,
            difficulty: category.difficulty,
            difficultyOrder: category.difficultyOrder
        })

    }
}