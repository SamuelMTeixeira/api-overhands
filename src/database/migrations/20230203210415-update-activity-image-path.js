'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {

      await queryInterface.changeColumn('Activities', 'imageDescription', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction })

      await queryInterface.changeColumn('Activities', 'correctImage', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction })


      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {

      await queryInterface.changeColumn('Activities', 'imageDescription', {
        type: Sequelize.BLOB,
        allowNull: true,
      }, { transaction })

      await queryInterface.changeColumn('Activities', 'correctImage', {
        type: Sequelize.BLOB,
        allowNull: true,
      }, { transaction })

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
