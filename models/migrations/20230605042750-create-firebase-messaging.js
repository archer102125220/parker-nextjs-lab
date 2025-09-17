'use strict';
// sequelize-cli 目前版本都有typescript支援問題
// https://github.com/sequelize/cli/issues/1099 最後的留言甚至表明尚不支援typescript

// import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
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
  async down(
    queryInterface
    // // ,Sequelize
    // queryInterface: QueryInterface
    // // ,Sequelize: typeof DataTypes
  ) {
    await queryInterface.dropTable('FirebaseMessagings');
  }
};
