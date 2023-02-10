const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

// Models
const User = require('../models/User')
const StudyTrack = require('../models/StudyTrack')
const Category = require('../models/Category')
const Activity = require('../models/Activity')
const Stat = require('../models/Stat')

const connection = new Sequelize(dbConfig)

const dbLogin = async () => {
    try {
        await connection.authenticate()
    } catch (error) {
        console.error('Não foi possível se conectar com a base dados: ', error);
    }
}

dbLogin()

// Conexões dos models
User.init(connection)
StudyTrack.init(connection)
Category.init(connection)
Activity.init(connection)
Stat.init(connection)

// Associação das chaves estrangeiras
User.associate(connection.models)
Category.associate(connection.models)
StudyTrack.associate(connection.models)
Activity.associate(connection.models)
Stat.associate(connection.models)

module.exports = connection