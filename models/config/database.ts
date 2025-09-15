'use strict';

import pg from 'pg';

// const nodeEnv = process.env.NODE_ENV || 'development';

//https://github.com/sequelize/cli/issues/766

const envConfig = {
  dialect: process.env.DB_CONNECTION,
  dialectModule: pg, // I've added this.
  host: process.env.POSTGRES_HOST,

  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,

  operatorsAliases: '0',
  define: {
    charset: process.env.DB_DEFINE_CHARSET,
    collate: process.env.DB_DEFINE_COLLATE
  },

  dialectOptions: {
    dialect: process.env.DB_CONNECTION,
    charset: process.env.DB_DIALECT_OPTIONS_CHARSET,
    collate: process.env.DB_DIALECT_OPTIONSE_COLLATE,
    instanceName: process.env.DB_SERVER_NAME,
    enableArithAbort: false,
    encrypt: true,
    ssl: true
  }
};

// module.exports = {
//   [nodeEnv]: envConfig
// };


export const development = envConfig;
export const production = envConfig;

export const env = {
  development,
  production
};
export default env;