'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('Activities', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        name: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },

        imageDescription: {
          type: Sequelize.BLOB,
          allowNull: true,
        },

        xp: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        type: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        correctImage: {
          type: Sequelize.BLOB,
          allowNull: true,
        },

        correctAnswer: {
          type: Sequelize.STRING(80),
          allowNull: true,
        },

        Category_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Categories', key: 'id' },
          onUpdate: 'RESTRICT',
          onDelete: 'RESTRICT',
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },

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
      await queryInterface.dropTable('Activities', { transaction })
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};