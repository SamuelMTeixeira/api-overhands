const minioClient = require('../minio')

module.exports = (bucketName) => {
    return new Promise((resolve, reject) => {
        const data = []
        const objectsStream = minioClient.listObjects(bucketName, '', true)
        objectsStream.on('error', reject)
        objectsStream.on('data', (obj) => {
            data.push(obj.name)
        })
        objectsStream.on('end', () => {
            const shuffledData = data.sort(() => Math.random() - 0.5)
            resolve(shuffledData)
        })
    })
}