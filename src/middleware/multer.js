const minioConnection = require('../minio')

const multer = require('multer')
const minioStorageEngine = require('multer-minio-storage-engine')

const upload = multer({
    storage: minioStorageEngine({
        minio: minioConnection,
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