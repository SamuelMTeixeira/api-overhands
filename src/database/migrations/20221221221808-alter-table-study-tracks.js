'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.changeColumn('StudyTracks', 'name', {
        type: Sequelize.STRING(80),
        allowNull: false,
      }, { transaction })

      await queryInterface.changeColumn('StudyTracks', 'description', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }, { transaction })

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {

  }
};
