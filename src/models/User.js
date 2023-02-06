const { Model, DataTypes } = require('sequelize')

class User extends Model {
    static init (sequelize) {
        super.init({
            name: DataTypes.STRING,
            lastname: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            isAdmin: DataTypes.BOOLEAN,
            situation: DataTypes.STRING,
            birth: DataTypes.DATE,
            gender: DataTypes.STRING
        }, { 
            sequelize,
        })
    }

    static associate(models) {
        this.hasMany(models.Stat, { foreignKey: 'Users_id', as: 'stat' })
    }
}

module.exports = User