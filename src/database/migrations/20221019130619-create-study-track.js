'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StudyTracks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(40),
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },

      idProfile: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // RESTRICT (PRA N DX EXCLUIR UM USER CASO TENHA UMA TRILHA DE ESTUDO)
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StudyTracks');
  }
};
