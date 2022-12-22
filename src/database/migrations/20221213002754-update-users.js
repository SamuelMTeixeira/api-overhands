'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.addColumn('Users', 'birth', {
      type: Sequelize.DATE,
      allowNull: true,
    })

    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.STRING(1),
      allowNull: true,
    })


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'birth')

    await queryInterface.removeColumn('Users', 'gender')
  }
};
