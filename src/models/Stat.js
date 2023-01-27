const { Model, DataTypes } = require('sequelize')

class Stat extends Model {
    static init(sequelize) {
        super.init({
            isCorrect: DataTypes.BOOLEAN,
            description: DataTypes.STRING
        }, {
            sequelize,
        })
    }

    static associate(models) {
        this.belongsTo(models.Activity, { foreignKey: 'Activity_id', as: 'activities' })
        
        this.belongsTo(models.User, { foreignKey: 'Users_id', as: 'user' })
    }

}

module.exports = Stat