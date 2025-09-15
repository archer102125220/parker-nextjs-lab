'use strict';
import { Model } from 'sequelize';

export interface FirebaseMessagingInterface extends Model {}

export function createFirebaseMessaging(sequelize, DataTypes) {
  class FirebaseMessaging implements FirebaseMessagingInterface {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }
  FirebaseMessaging.init(
    {
      token: DataTypes.STRING,
      os: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'FirebaseMessaging'
    }
  );
  return FirebaseMessaging;
}
export default createFirebaseMessaging;
