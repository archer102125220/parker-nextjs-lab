import type { SerwistGlobalConfig } from 'serwist';

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

import type {
  FirebaseOptions,
  FirebaseApp,
  Messaging
} from '@/utils/third-party/firebase';
import { FIREBASE_CONFIG as firebaseConfig } from '@/utils/third-party/firebase';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    firebase: FirebaseApp | null;
    firebaseMessaging: Messaging | null;
    firebaseConfig: FirebaseOptions;
  }
}

declare const self: ServiceWorkerGlobalScope;

// https://medium.com/@sumanthegde123/web-push-notifications-with-react-and-firebase-with-safari-error-handling-d2979d10c9ac
// function loadingFirebaseConfig(event) {
//   try {
//     // const url = event?.request?.url || '';
//     // const search = url.substring(url.indexOf('?') + 1);
//     // const urlParams = new URLSearchParams(search);
//     // const firebaseConfig = Object.fromEntries(urlParams);

//     const dataParams = new URLSearchParams(event?.data);
//     const firebaseConfig = Object.fromEntries(dataParams);
//     if (typeof firebaseConfig.apiKey === 'string') {
//       self.firebaseConfig = firebaseConfig;

//       const { firebase, firebaseMessaging } = firebaseInitializeApp(firebaseConfig);
//       self.firebase = firebase;
//       self.firebaseMessaging = firebaseMessaging;

//       // self.removeEventListener('fetch', loadingFirebaseConfig);
//       self.removeEventListener('message', loadingFirebaseConfig);
//     }
//   } catch (err) {
//     console.error('Failed to add event listener', err);
//   }
// }
// // self.addEventListener('fetch', loadingFirebaseConfig);
// self.addEventListener('message', loadingFirebaseConfig);

const { firebase, firebaseMessaging } = firebaseInitializeApp(firebaseConfig);

self.firebase = firebase;
self.firebaseMessaging = firebaseMessaging;

// function handleSWUpdate(event) {
//   if (!event.data) {
//     return;
//   }

//   if (event.data === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// }
// self.addEventListener('message', handleSWUpdate);

self.addEventListener('notificationclick', function (event) {
  // 關閉通知
  event.notification.close();

  // // 檢查是否已定義 action
  // if (event.action === 'some_action') {
  //   // 執行與特定 action 相關的程式碼
  //   // 例如，開啟特定頁面
  //   event.waitUntil(clients.openWindow('/specific-page.html'));
  // } else {
  //   // 處理預設點擊行為
  //   event.waitUntil(clients.openWindow('/'));
  // }

  event.waitUntil(self.clients.openWindow('/'));
});

function firebaseInitializeApp(_firebaseConfig: FirebaseOptions) {
  try {
    // Initialize the Firebase app in the service worker by passing in
    // your app's Firebase config object.
    // https://firebase.google.com/docs/web/setup#config-object
    // Set Firebase configuration, once available
    const newFirebase = initializeApp(
      self.firebaseConfig || _firebaseConfig || firebaseConfig
    );

    // Retrieve an instance of Firebase Messaging so that it can handle background
    // messages.
    const newFirebaseMessaging = getMessaging(newFirebase);

    /*
      interface MessagePayload {
        readonly collapseKey: string; // 僅限 FCM 訊息才有
        readonly from: string;       // 訊息的發送者
        readonly messageId: string;  // 訊息的唯一 ID
        readonly messageType: string; // "push" 或 "data"

        readonly data?: { [key: string]: string }; // 如果有資料訊息，則包含此屬性

        readonly notification?: NotificationPayload; // 如果有通知訊息，則包含此屬性

        readonly rawData: object; // 原始訊息數據，可能包含更多低級別屬性
      }

      interface NotificationPayload {
        readonly title: string | undefined;
        readonly body: string | undefined;
        readonly image: string | undefined; // 如果設定了通知圖片
        // 還有其他可能的標準通知屬性，例如 icon, badge, click_action, tag, etc.
        // 這些屬性通常在 `notification` 物件內部，或者作為 `data` 的一部分，視如何發送而定
      }
    */
    onBackgroundMessage(newFirebaseMessaging, (payload) => {
      console.log(
        '[firebase-messaging.js] Received background message ',
        payload
      );

      // Customize notification here
      // const notificationTitle = 'Background Message Title';
      // const notificationOptions = {
      //   body: 'Background Message body.',
      //   icon: '/firebase-logo.png'
      // };

      const notificationTitle =
        payload?.notification?.title || payload?.data?.title || '';
      const notificationBody =
        payload?.notification?.body || payload?.data?.msg || '';
      const notificationIcon =
        payload?.notification?.image || payload?.data?.img || '';

      // self.registration.showNotification(notificationTitle, notificationOptions);
      if (
        (typeof notificationTitle === 'string' && notificationTitle !== '') ||
        (typeof notificationBody === 'string' && notificationBody !== '') ||
        (typeof notificationIcon === 'string' && notificationIcon !== '')
      ) {
        self.registration.showNotification(notificationTitle, {
          body: notificationBody,
          icon: notificationIcon || '/img/favicon/favicon.ico'
        });
      }
    });

    return { firebase: newFirebase, firebaseMessaging: newFirebaseMessaging };
  } catch (error) {
    console.error(error);
  }

  return { firebase: null, firebaseMessaging: null };
}
