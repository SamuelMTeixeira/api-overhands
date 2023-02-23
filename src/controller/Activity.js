// Models
const Activities = require('../models/Activity')

// MinIO
const getPresignedUrl = require('../minio/getPresignedUrl')

const getImages = require('../minio/getImages')

const { Configuration, OpenAIApi } = require("openai")

require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
    async index(req, res) {

        const { idCategory } = req.query

        if (!idCategory) {
            return res.status(400).json({ error: "Missing activity ID" })
        }

        const activities = await Activities.findAll({
            where: { Category_id: idCategory },
        })

        const results = await Promise.all(
            activities.map(getActivityWithWrongOptions)
        )

        res.json(results.sort())
    },

    async store(req, res) {

        const { name, type, xp, idCategory, correctAnswer, tip } = JSON.parse(req.body.informations)

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
                return await createQuizTypeImage({ name, type, xp, correctAnswer, imageDescription: objectName, Category_id: idCategory, tip }, res)
            case 2:
                return await createQuizTypeText({ name, type, xp, correctImage: objectName, Category_id: idCategory, tip }, res)
        }
    }

}

// * Quiz options
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

// Configs options
const getActivityWithWrongOptions = async (activity) => {
    const result = { ...activity.toJSON() }

    if (activity.imageDescription) {
        result.imageDescription = await getPresignedUrl("tcc", activity.imageDescription, 604800)
    } else if (activity.correctImage) {
        result.correctImage = await getPresignedUrl("tcc", activity.correctImage, 604800)
    }

    if (activity.type === 1) {
        const openai = new OpenAIApi(configuration)

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Escreva apenas o nome de 3 sinais da Língua Brasileira de Sinais que a configuração de mão se parece com o sinal: ${activity.correctAnswer},
            na qual não contenha espaços antes e depois da virgula. Sem mais detalhes`,
            max_tokens: 1000,
        });

        const words = completion.data.choices[0].text

        const wordsArray = words
            .replace(/[.\s:]+/g, "")
            .split(",")

        result.wrongOptions = wordsArray;
    } else {
        const imgNames = await getImages("images-random")
        const presignedUrls = await Promise.all(
            imgNames.map((imgName) =>
                getPresignedUrl("images-random", imgName, 604800)
            )
        )
        result.wrongOptions = [presignedUrls[0], presignedUrls[1], presignedUrls[2]]
    }

    return result;
}