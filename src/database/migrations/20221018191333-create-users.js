'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(30) ,
        allowNull: false,
      },

      lastname: {
        type: Sequelize.STRING(50) ,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(50) ,
        allowNull: false,
      },

      password: {
        type: Sequelize.STRING(150) ,
        allowNull: false,
      },

      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },

      xp: {
        type: Sequelize.INTEGER ,
        allowNull: false,
      },

      idGoogle: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE ,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE ,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
