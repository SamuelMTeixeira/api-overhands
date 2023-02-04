require('dotenv').config()

module.exports = {
    endPoint: 'localhost',
    port: 80,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
}