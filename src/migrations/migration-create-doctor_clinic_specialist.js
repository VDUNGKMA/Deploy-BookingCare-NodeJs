'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('specialist', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
     doctorId: {
        type: Sequelize.INTEGER
      },
      clinicId: {
        type: Sequelize.INTEGER
      },
      specialId: {
        type: Sequelize.INTEGER
      },
      
      timeType: {
        type: Sequelize.STRING
      },
     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('specialist');
  }
};