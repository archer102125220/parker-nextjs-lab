'use strict';
import { QueryInterface } from 'sequelize';

// eslint-disable-next-line import/no-anonymous-default-export
module.exports = {
  up: (queryInterface: QueryInterface) => {
    // TODO
    // @ts-ignore
    const { database, dialectOptions, dialect } =
      queryInterface.sequelize.config;
    // TODO
    // @ts-ignore
    const { charset, collate } = dialectOptions;

    const mySql = `ALTER DATABASE ${database}
      CHARACTER SET ${charset || 'utf8'} COLLATE ${
        collate || 'utf8_general_ci'
      };`;
    const msSql = 'SELECT 11';

    return queryInterface.sequelize.query(dialect === 'msSql' ? mySql : msSql);
  }
  // down: (queryInterface, Sequelize) => { }
};
