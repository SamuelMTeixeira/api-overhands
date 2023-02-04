const minioClient = require('../minio')

module.exports = (bucketName, objectName, expires) => {
    return new Promise((resolve, reject) => {
        minioClient.presignedGetObject(
            bucketName,
            objectName,
            expires,
            (error, presignedUrl) => {
                if (error) {
                    return reject(error)
                }

                resolve(presignedUrl);
            }
        )
    })
}