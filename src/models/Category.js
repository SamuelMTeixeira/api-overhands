const { Model, DataTypes } = require('sequelize')

class Category extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            image: DataTypes.STRING,
            difficulty: DataTypes.STRING,
            difficultyOrder: DataTypes.INTEGER
        }, {
            sequelize,
        })
    }

    static associate(models) {
        this.belongsTo(models.StudyTrack, { foreignKey: 'StudyTracks_id', as: 'StudyTracks' });
    }
}

module.exports = Category