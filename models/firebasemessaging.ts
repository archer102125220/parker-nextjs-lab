'use strict';
import { Model } from 'sequelize';
import { Sequelize, DataTypes } from 'sequelize';

export abstract class FirebaseMessagingAbstract extends Model {
  declare token: DataTypes.StringDataType;
  declare os: DataTypes.StringDataType;
}

export function createFirebaseMessaging(
  sequelize: Sequelize,
  _DataTypes: typeof DataTypes
): typeof FirebaseMessagingAbstract {
  class FirebaseMessaging extends FirebaseMessagingAbstract {
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
