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
        this.hasMany(models.StudyTrack, { foreignKey: 'StudyTracks_id', as: 'Categories' });
    }

}

module.exports = StudyTrack