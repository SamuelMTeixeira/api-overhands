const Category = require('../models/Category')

module.exports = {
    async index(req, res) {

        const allCategories = await Category.findAll({
            attributes: ['name', 'image', 'difficulty', 'difficultyOrder']
        });

        return await res.json(allCategories)
    },

    async store(req, res) {



    }
}