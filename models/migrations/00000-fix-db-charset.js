'use strict';
// sequelize-cli 目前版本都有typescript支援問題
// https://github.com/sequelize/cli/issues/1099 最後的留言甚至表明尚不支援typescript

// import { QueryInterface } from 'sequelize';

 
module.exports = {
  // up(queryInterface: QueryInterface) {
  up(queryInterface) {
    // TODO
    // eslint-disable-next-line
    // @ts-ignore
    const { database, dialectOptions, dialect } =
      queryInterface.sequelize.config;
    // TODO
    // eslint-disable-next-line
    // @ts-ignore
    const { charset, collate } = dialectOptions;

    const mySql = `ALTER DATABASE ${database}
      CHARACTER SET ${charset || 'utf8'} COLLATE ${collate || 'utf8_general_ci'
      };`;
    const msSql = 'SELECT 11';

    return queryInterface.sequelize.query(dialect === 'msSql' ? mySql : msSql);
  }
  // down (queryInterface, Sequelize) { }
};
