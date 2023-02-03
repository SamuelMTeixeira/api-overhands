const Minio = require('minio')
const minioConfig = require('../config/minIO')

const minioClient = new Minio.Client(minioConfig)

module.exports = minioClient