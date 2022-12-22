const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

// Models
const User = require('../models/User')
const StudyTrack = require('../models/StudyTrack')
const Category = require('../models/Category')

const connection = new Sequelize(dbConfig)

// Conexões dos models
User.init(connection)
StudyTrack.init(connection)
Category.init(connection)

// Associação das chaves estrangeiras
Category.associate(connection.models)
StudyTrack.associate(connection.models)

module.exports = connection