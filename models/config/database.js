'use strict';
// sequelize-cli 目前版本都有typescript支援問題
// https://github.com/sequelize/cli/issues/1099 最後的留言甚至表明尚不支援typescript

// import pg from 'pg';

const pg = require('pg');

const nodeEnv = process.env.NODE_ENV || 'development';

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

const env = {
  development: envConfig,
  production: envConfig
};
module.exports = {
  ...env,
  env,
  default: env,
  [nodeEnv]: envConfig
};

// export const development = envConfig;
// export const production = envConfig;

// export const env = {
//   development,
//   production
// };
// export default env;
