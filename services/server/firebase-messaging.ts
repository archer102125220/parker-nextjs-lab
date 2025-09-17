import { FirebaseMessaging, Sequelize } from '@/models';
const { Op } = Sequelize;

type addTokenPayloadType = {
  token?: String;
  os?: String;
};
export async function messagingAddToken(
  payload: addTokenPayloadType = { token: '', os: '' }
) {
  const response = await FirebaseMessaging.findOrCreate({
    where: {
      [Op.and]: [
        { token: { [Op.eq]: payload.token } },
        { os: { [Op.eq]: payload.os } }
      ]
    },
    defaults: { ...payload }
  });
  return response;
}

export async function messagingRemoveToken(token = '') {
  const response = await FirebaseMessaging.destroy({
    where: { token }
  });
  return response;
}

export async function messagingFindToken(token = '') {
  const response = await FirebaseMessaging.find({
    where: { token }
  });
  return response;
}

type findAllTokenWhereType = {
  token?: String;
  os?: String;
};
export async function messagingFindAllToken(
  payload: findAllTokenWhereType = { token: '', os: '' }
) {
  const where: findAllTokenWhereType = {};
  if (typeof payload.os === 'string' && payload.os !== '') {
    where.os = payload.os;
  }
  if (typeof payload.token === 'string' && payload.token !== '') {
    where.token = payload.token;
  }

  const response = await FirebaseMessaging.findAll({ where });
  return response;
}
