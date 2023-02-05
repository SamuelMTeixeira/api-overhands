'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.removeColumn('Users', 'xp', { transaction })
      await queryInterface.removeColumn('Users', 'idGoogle', { transaction })

      await queryInterface.changeColumn('Users', 'birth', {
        type: Sequelize.DATE,
        allowNull: false,
      }, { transaction })

      await queryInterface.changeColumn('Users', 'gender', {
        type: Sequelize.STRING(1),
        allowNull: false,
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

      await queryInterface.addColumn('Users', 'xp', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }, { transaction })

      await queryInterface.addColumn('Users', 'idGoogle', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction })

      await queryInterface.changeColumn('Users', 'birth', {
        type: Sequelize.DATE,
        allowNull: true,
      }, { transaction })

      await queryInterface.changeColumn('Users', 'gender', {
        type: Sequelize.STRING(1),
        allowNull: true,
      }, { transaction })

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  }
};
