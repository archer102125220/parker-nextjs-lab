import type { Sequelize as SequelizeType } from 'sequelize';
import { Sequelize as _Sequelize, DataTypes } from 'sequelize';
import process from 'process';

import databaseConfig from '@/models/config/database.mjs';
// import type { FirebaseMessaging as FirebaseMessagingType } from '@/models/firebasemessaging';
import { createFirebaseMessaging } from '@/models/firebasemessaging';

// const databaseConfig = require('@/models/config/database');

const pluginBatabases = {
  FirebaseMessaging: createFirebaseMessaging
};

const env = process.env.NODE_ENV || 'development';
// TODO
// eslint-disable-next-line
// @ts-ignore
const config = databaseConfig[env] || {};

let _sequelize: SequelizeType | null = null;
if (config.use_env_variable) {
  // TODO
  // eslint-disable-next-line
  // @ts-ignore
  _sequelize = new _Sequelize(process.env[config.use_env_variable], config);
} else {
  _sequelize = new _Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

type selfeDatabasesType = {
  sequelize?: SequelizeType;

  // TODO
  // Sequelize?: typeof _Sequelize;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Sequelize?: any;

  // TODO
  // FirebaseMessaging?: typeof FirebaseMessagingType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FirebaseMessaging?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const selfeDatabases: selfeDatabasesType = {
  FirebaseMessaging: pluginBatabases.FirebaseMessaging(_sequelize, DataTypes)
};

Object.keys(selfeDatabases).forEach((modelName: string) => {
  const model = selfeDatabases[modelName];
  if (typeof model?.associate === 'function') {
    model.associate(selfeDatabases);
  }
});

selfeDatabases.sequelize = _sequelize;
selfeDatabases.Sequelize = _Sequelize;

export const FirebaseMessaging = selfeDatabases.FirebaseMessaging;
export const sequelize = selfeDatabases.sequelize;
export const Sequelize = selfeDatabases.Sequelize;

export const database = selfeDatabases;
export default database;
