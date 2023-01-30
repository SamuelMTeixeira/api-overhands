'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.removeColumn('Categories', 'image', { transaction })

      await queryInterface.changeColumn('Categories', 'difficulty', {
        type: Sequelize.STRING(45),
        allowNull: false,
      }, { transaction })

      await queryInterface.changeColumn('Categories', 'difficultyOrder', {
        type: Sequelize.INTEGER,
        allowNull: true,
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
