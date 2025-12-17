import { request } from '@/utils/request';

const prefix = '/nextjs-server/firebase-admin';

export function GET_getMessageTokens(
  useServiceWorkerCache: boolean = false,
  useCache: boolean = false
) {
  return request.get(`${prefix}/get-push-notification-tokens`, null, {
    useServiceWorkerCache,
    useCache
  });
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_registerMessageToken(payload: any) {
  console.log({ ['request.baseURL']: request.baseURL });
  if (typeof request.baseURL === 'undefined') {
    return POST_registerMessageTokenRetry(payload);
  }
  return request.post(`${prefix}/register-push-notification-token`, payload);
}
// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_registerMessageTokenRetry(payload: any) {
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
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_pushNotification(payload: any) {
  return request.post(`${prefix}/push-notification`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DELETE_cancelMessageToken(payload: any) {
  return request.delete(`${prefix}/cancel-push-notification-token/${payload}`);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DELETE_cancelAllMessageToken(payload: any) {
  return request.delete(
    `${prefix}/cancel-push-notification-token/all/${payload}`
  );
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_androidPushNotification(payload: any) {
  return request.post(`${prefix}/android-push-notification`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_iosPushNotification(payload: any) {
  return request.post(`${prefix}/ios-push-notification`, payload);
}

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function POST_webPushMessage(payload: any) {
  return request.post(`${prefix}/web-push-notification`, payload);
}
