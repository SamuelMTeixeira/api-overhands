const { Model, DataTypes } = require('sequelize')

class User extends Model {
    static init (sequelize) {
        super.init({
            name: DataTypes.STRING,
            lastname: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            isAdmin: DataTypes.BOOLEAN,
            xp: DataTypes.INTEGER,
            idGoogle: DataTypes.STRING,
            situation: DataTypes.STRING
        }, { 
            sequelize,
        })
    }


    static associate(models) {
        this.hasMany(models.StudyTrack, { foreignKey: 'idProfile', as: 'StudyTracks' });
    }

}

module.exports = User