require('dotenv').config()

module.exports = {
    endPoint: process.env.MINIO_URL,
    useSSL: true,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
}

// * for test local, please use this template: 
/*
    endPoint: process.env.MINIO_URL,
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
*/