'use strict';
import type { Sequelize, DataTypes } from 'sequelize';
import { Model } from 'sequelize';

export class FirebaseMessaging extends Model {
  declare token: DataTypes.StringDataType;
  declare os: DataTypes.StringDataType;

  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  // eslint-disable-next-line no-unused-vars
  static associate(models: any) {
    // define association here
  }
}

export function createFirebaseMessaging(
  sequelize: Sequelize,
  _DataTypes: typeof DataTypes
): typeof FirebaseMessaging {
  FirebaseMessaging.init(
    {
      token: _DataTypes.STRING,
      os: _DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'FirebaseMessaging'
    }
  );
  return FirebaseMessaging;
}
export default createFirebaseMessaging;
