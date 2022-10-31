const { Model, DataTypes } = require('sequelize')

class StudyTrack extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            idProfile: DataTypes.INTEGER
        }, {
            sequelize,
        })
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'idProfile', as: 'Users' });
    }
}

module.exports = StudyTrack