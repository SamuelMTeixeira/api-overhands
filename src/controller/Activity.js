// Models
const Activities = require('../models/Activity')

const getPresignedUrl = require('../minio/getPresignedUrl')

module.exports = {
    async index(req, res) {

        const { idCategory } = req.body

        // Validations
        if (!idCategory)
            return await res.status(400).json({ error: 'Missing activity ID' })

        // Query
        const activities = await Activities.findAll({
            attributes: ['id', 'name', 'imageDescription', 'xp', 'type', 'correctImage'],
            where: { "Category_id": idCategory }
        })

        // * Take a image name and get a url in the bucket
        const promises = activities.map(async activity => {
            if (activity.imageDescription) {
                try {
                    const presignedUrl = await getPresignedUrl('tcc', activity.imageDescription, 1000)
                    activity.imageDescription = presignedUrl
                } catch (error) {
                    console.error(error);
                }
            } else if (activity.correctImage) {
                try {
                    const presignedUrl = await getPresignedUrl('tcc', activity.correctImage, 1000)
                    activity.correctImage = presignedUrl
                } catch (error) {
                    console.error(error);
                }
            }
        });

        await Promise.all(promises)

        return res.json(activities)
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


        // Create the quiz
        switch (type) {
            case 1:
                return await createQuizTypeImage({ name, type, xp, correctAnswer, imageDescription: objectName, Category_id: idCategory }, res)
            case 2:
                return await createQuizTypeText({ name, type, xp, correctImage: objectName, Category_id: idCategory }, res)
        }
    }

}


const createQuizTypeImage = async (data, res) => {

    if (!data.correctAnswer)
        return await res.status(400).json({ error: 'A correct answer is missing' })

    const newActivityText = await Activities.create(data);

    return await res.json({ status: `Activity '${newActivityText.name}' was successfully created` });
}

const createQuizTypeText = async (data, res) => {

    const newActivityText = await Activities.create(data)

    return await res.json({ status: `Activity '${newActivityText.name}' was successfully created` })
}