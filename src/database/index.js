const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

// Models
const User = require('../models/User')
const StudyTrack = require('../models/StudyTrack')

const connection = new Sequelize(dbConfig)

// Conexões dos models
User.init(connection)
StudyTrack.init(connection)

// Associação das chaves estrangeiras
User.associate(connection.models)
StudyTrack.associate(connection.models)

module.exports = connection