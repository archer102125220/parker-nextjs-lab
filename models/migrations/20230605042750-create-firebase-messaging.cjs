'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FirebaseMessagings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      os: {
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
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable('FirebaseMessagings');
  }
};
