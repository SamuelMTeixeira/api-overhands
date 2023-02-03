const minioClient = require('../minio')

const multer = require('multer')
const multerMinio = require('multer-minio-storage-engine')

const upload = multer({
    storage: multerMinio({
        minio: minioClient,
        bucketName: 'tcc',
        metaData: function (req, file, cb) {
            cb(null, { mimetype: file.mimetype });
        },
        objectName: function (req, file, cb) {

            const fileName = `${Date.now().toString()}-${file.originalname}`
            
            cb(null, fileName);
            
        },
    }),
});

module.exports = upload