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

        if (!idCategory) {
            return res.status(400).json({ error: "Missing activity ID" })
        }

        const activities = await Activities.findAll({
            where: { Category_id: idCategory },
        })

        const results = await Promise.all(
            activities.map(getActivityWithWrongOptions)
        )

        results.sort(() => Math.random() - 0.5)
        res.json(results)
    },

    async storeQuizTypeText(req, res) {
        const { name, xp, idCategory, correctAnswer, tip } = JSON.parse(req.body.informations)

        // Take the image name uploaded
        const { objectName } = req.file

        // Validations
        if (!idCategory || !xp || !name || !tip)
            return await res.status(400).json({ error: 'Some important params is missing' })

        return await createQuizTypeText({ name, type: 1, xp, correctAnswer, imageDescription: objectName, Category_id: idCategory, tip }, res)
    },

    async storeQuizTypeImage(req, res) {

        // Take the image name uploaded
        const { files, body } = req

        const { name, xp, idCategory, tip } = JSON.parse(body.informations)

        // Validations
        if (!idCategory || !xp || !name || !tip)
            return await res.status(400).json({ error: 'Some important params is missing' })

        const wrongImages = files
            .filter((file, index) => index > 0)
            .map((file) => { return { name: file.objectName } })

        return await createQuizTypeImage({ name, type: 2, xp, correctImage: files[0].objectName, Category_id: idCategory, tip, wrongImages }, res)
    }

}


// * SOME SYSTEM FUNCTIONS


// Neste quiz, o usuário tem que escolher o texto correto
const createQuizTypeText = async (data, res) => {

    if (!data.correctAnswer)
        return await res.status(400).json({ error: 'A correct answer is missing' })

    const newActivityText = await Activities.create(data);

    return await res.json({ status: `Activity '${newActivityText.name}' was successfully created` });
}

// Neste quiz, o usuário tem que escolher a imagem correta
const createQuizTypeImage = async (data, res) => {

    const newActivityText = await Activities.create(data)

    return await res.json({ status: `Activity '${newActivityText.name}' was successfully created` })
}

// * Configs options
const getActivityWithWrongOptions = async (activity) => {
    const result = { ...activity.toJSON() }

    if (activity.imageDescription) {
        result.imageDescription = await getPresignedUrl("tcc", activity.imageDescription, 604800)
    }

    if (activity.correctImage) {
        result.correctImage = await getPresignedUrl("tcc", activity.correctImage, 604800)
    }

    if (activity.type === 1) {
        const openai = new OpenAIApi(configuration)

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Retorne o nome de 3 sinais da Língua Brasileira de Sinais na qual a configuração de mão se assemelhe com o sinal ${activity.correctAnswer} e não seja sinônimo,
            me mande apenas as 3 palavras separadas por virgula, não use espaço antes e depois da palavra e mais nada. Considere que as opções são para um quiz, então use apenas sinais que possam confundir o aluno.
            Exemplo de resposta:teste,teste,teste`,
            max_tokens: 1000,
        });

        const words = completion.data.choices[0].text

        const wordsArray = words
            .replace(/^\s+|[.:]+/g, "")
            .split(",")
            .map(word => word.toLowerCase())

        result.options = [...wordsArray, result.correctAnswer.toLowerCase()]
    } else {

        const imgNames = result.wrongImages
        const presignedUrls = await Promise.all(
            imgNames.map((imgName) =>
                getPresignedUrl("tcc", imgName.name, 604800)
            )
        )
        result.options = [...presignedUrls, result.correctImage]
    }

    // Algoritmo de Fisher-Yates
    for (let i = result.options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result.options[i], result.options[j]] = [result.options[j], result.options[i]];
    }

    delete result.wrongImages
    return result
}