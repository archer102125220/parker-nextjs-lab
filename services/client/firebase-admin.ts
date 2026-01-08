import { unstable_cache } from 'next/cache';
import { request } from '@/utils/request';

const prefix = '/nextjs-server/firebase-admin';

export const GET_getMessageTokens = unstable_cache(
  async function () {
    return request.get(`${prefix}/get-push-notification-tokens`);
  },
  ['GET_getMessageTokens'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const POST_registerMessageToken = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    console.log({ ['request.baseURL']: request.baseURL });
    if (typeof request.baseURL === 'undefined') {
      return POST_registerMessageTokenRetry(payload);
    }
    return request.post(`${prefix}/register-push-notification-token`, payload);
  },
  ['POST_registerMessageToken'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const POST_registerMessageTokenRetry = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return new Promise((resolve, reject) => {
      setTimeout(async function () {
        try {
          const response = await POST_registerMessageToken(payload);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  },
  ['POST_registerMessageTokenRetry'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const POST_pushNotification = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.post(`${prefix}/push-notification`, payload);
  },
  ['POST_pushNotification'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const DELETE_cancelMessageToken = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.delete(
      `${prefix}/cancel-push-notification-token/${payload}`
    );
  },
  ['DELETE_cancelMessageToken'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const DELETE_cancelAllMessageToken = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.delete(
      `${prefix}/cancel-push-notification-token/all/${payload}`
    );
  },
  ['DELETE_cancelAllMessageToken'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const POST_androidPushNotification = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.post(`${prefix}/android-push-notification`, payload);
  },
  ['POST_androidPushNotification'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const POST_iosPushNotification = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.post(`${prefix}/ios-push-notification`, payload);
  },
  ['POST_iosPushNotification'],
  {
    revalidate: 60 * 60 * 24
  }
);

export const POST_webPushMessage = unstable_cache(
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function (payload: any) {
    return request.post(`${prefix}/web-push-notification`, payload);
  },
  ['POST_webPushMessage'],
  {
    revalidate: 60 * 60 * 24
  }
);
