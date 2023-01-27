const { Model, DataTypes } = require('sequelize')

class Activity extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            imageDescription: DataTypes.BLOB,
            xp: DataTypes.INTEGER,
            type: DataTypes.INTEGER,
            correctImage: DataTypes.BLOB,
            correctAnswer: DataTypes.STRING,
        }, {
            sequelize,
        })
    }

    static associate(models) {
        this.belongsTo(models.Category, { foreignKey: 'Category_id', as: 'category' })

        this.hasMany(models.Stat, { foreignKey: 'Activity_id', as: 'stats' })
    }
}

module.exports = Activity