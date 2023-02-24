const { Model, DataTypes } = require('sequelize')

class Activity extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            imageDescription: DataTypes.STRING,
            xp: DataTypes.INTEGER,
            type: DataTypes.INTEGER,
            tip: DataTypes.STRING,
            correctImage: DataTypes.STRING,
            correctAnswer: DataTypes.STRING,
            wrongImages: DataTypes.JSON
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