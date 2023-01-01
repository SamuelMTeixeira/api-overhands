const { Model, DataTypes } = require('sequelize')

class StudyTrack extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING
        }, {
            sequelize,
        })
    }

    static associate(models) {
        this.hasMany(models.Category, { foreignKey: 'StudyTracks_id', as: 'categories' })
    }

}

module.exports = StudyTrack