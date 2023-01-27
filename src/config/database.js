require('dotenv').config()

module.exports = {
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    define: {
        timestamps: true,
        underscored: false,  // Se tiver true significa que vai separar o espaço do nome da tabela por _
    },
    timezone: '-03:00',
}