import { unstable_cache } from 'next/cache';
import { FirebaseMessaging, Sequelize } from '@/models';
const { Op } = Sequelize;

type addTokenPayloadType = {
  token?: string;
  os?: string;
};
export const messagingAddToken = unstable_cache(
  async function (payload: addTokenPayloadType = { token: '', os: '' }) {
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
  },
  ['messagingAddToken'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const messagingRemoveToken = unstable_cache(
  async function (token = '') {
    const response = await FirebaseMessaging.destroy({
      where: { token }
    });
    return response;
  },
  ['messagingRemoveToken'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const messagingFindToken = unstable_cache(
  async function (token = '') {
    const response = await FirebaseMessaging.find({
      where: { token }
    });
    return response;
  },
  ['messagingFindToken'],
  {
    revalidate: 60 * 60 * 24
  }
);

type findAllTokenWhereType = {
  token?: string;
  os?: string;
};
export const messagingFindAllToken = unstable_cache(
  async function (payload: findAllTokenWhereType = { token: '', os: '' }) {
    const where: findAllTokenWhereType = {};
    if (typeof payload.os === 'string' && payload.os !== '') {
      where.os = payload.os;
    }
    if (typeof payload.token === 'string' && payload.token !== '') {
      where.token = payload.token;
    }

    const response = await FirebaseMessaging.findAll({ where });
    return response;
  },
  ['messagingFindAllToken'],
  {
    revalidate: 60 * 60 * 24
  }
);
