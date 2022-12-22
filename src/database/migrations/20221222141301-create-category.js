'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.createTable('Categories', {
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

        image: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },

        difficulty: {
          type: Sequelize.STRING(45),
          allowNull: true,
        },

        difficultyOrder: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        StudyTracks_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'StudyTracks', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE', // RESTRICT (PRA N DX EXCLUIR UMA CATEGORIA CASO TENHA UMA TRILHA DE ESTUDO CHAMANDO ELA)
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
      await queryInterface.dropTable('Category', { transaction })
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
