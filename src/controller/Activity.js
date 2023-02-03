// Models
const Activities = require('../models/Activity')

const sequelize = require('../database')

module.exports = {
    async index(req, res) {

        const { idCategory } = req.body

        // Validations
        if (!idCategory)
            return await res.status(400).json({ error: 'Activity ID is missing' })

        // Query
        const allActitivies = await Activities.findAll({
            where: { "Category_id": idCategory }
        })

        return await res.json(allActitivies)
    },

    async store(req, res) {

        const { name, type, xp, idCategory, correctAnswer } = JSON.parse(req.body.informations)

        // Take the image name uploaded
        const { objectName } = req.file

        // Validations
        if (!idCategory || !type || !xp || !name)
            return await res.status(400).json({ error: 'Some important params is missing' })

        if (![1, 2].includes(type))
            return res.status(400).json({ error: 'Type invalid' })


        // Insert in database

        switch (type) {
            // * Quiz type: guess the image
            case 1:
                if (!correctAnswer)
                    return await res.status(400).json({ error: 'A correct answer is missing' })

                const newActivityImage = await Activities.create({ name, type, xp, correctAnswer, imageDescription: objectName, Category_id: idCategory })

                return await res.json({ status: `Activity '${newActivityImage.name}' was successfully created` })


            // * Quiz type: guess the text
            case 2:
                const newActivityText = await Activities.create({ name, type, xp, correctImage: objectName, Category_id: idCategory })

                return await res.json({ status: `Activity '${newActivityText.name}' was successfully created` })
        }

    }

}