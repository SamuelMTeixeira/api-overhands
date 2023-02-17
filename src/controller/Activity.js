// Models
const Activities = require('../models/Activity')

// MinIO
const getPresignedUrl = require('../minio/getPresignedUrl')

const { Configuration, OpenAIApi } = require("openai")

require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

module.exports = {
    async index(req, res) {

        const { idCategory } = req.query

        // Validations
        if (!idCategory)
            return await res.status(400).json({ error: 'Missing activity ID' })

        // Query
        const activities = await Activities.findAll({
            where: { "Category_id": idCategory }
        })

        const openai = new OpenAIApi(configuration)

        let result = []

        // * Take an image name and request an url for this image
        const promises = activities.map(async activity => {
            if (activity.imageDescription) {
                try {
                    const presignedUrl = await getPresignedUrl('tcc', activity.imageDescription, 604800) // 604800 = Expires in 7 days
                    activity.imageDescription = presignedUrl
                } catch (error) {
                    console.error(error);
                }
            } else if (activity.correctImage) {
                try {
                    const presignedUrl = await getPresignedUrl('tcc', activity.correctImage, 604800)
                    activity.correctImage = presignedUrl
                } catch (error) {
                    console.error(error);
                }
            }

            const completion = await openai.createCompletion({
                model: 'text-davinci-003',
                prompt: `Crie 3 alternativas fakes (apenas a palavra) para um quiz de conteúdo da Língua Brasileira de sinais (separadas por virgula e sem pontos ou espaços antes e depois da vírgula), na qual a palavra correta é ${activity.correctAnswer}`,
                max_tokens: 1000
            })

            if (activity.type === 1) {
                const words = completion.data.choices[0].text
                let wordsArray = words.replace(/[\s.]+/g, "")
                wordsArray = wordsArray.split(",")

                result.push({ ...activity.toJSON(), wrongOptions: wordsArray })
            }
            else {
                result.push({ ...activity.toJSON() })
            }

        });

        await Promise.all(promises)

        return await res.json(result.sort())
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