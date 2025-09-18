import type {
  FirebaseOptions as _FirebaseOptions,
  FirebaseApp as _FirebaseApp
} from 'firebase/app';
import { initializeApp, initializeServerApp } from 'firebase/app';
import type { Analytics as _Analytics } from 'firebase/analytics';
import {
  getAnalytics,
  logEvent,
  isSupported as analyticsIsSupported
} from 'firebase/analytics';
import type { Firestore as _Firestore } from 'firebase/firestore/lite';
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore/lite';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import type { Messaging as _Messaging } from 'firebase/messaging';
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported as messagingIsSupported
} from 'firebase/messaging';

import { POST_registerMessageToken } from '@/services/client/firebase-admin';

// https://firebase.google.com/docs/cloud-messaging/js/receive?hl=zh-cn#web-version-9_2

// Your web app's Firebase configuration
// For Firebase JS SDK v11.10.0 and later, measurementId is optional
export const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'parker-nextjs-lab.firebaseapp.com',
  projectId: 'parker-nextjs-lab',
  storageBucket: 'parker-nextjs-lab.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};
export type FirebaseOptions = _FirebaseOptions;
export type FirebaseApp = _FirebaseApp;
export type Analytics = _Analytics;
export type Firestore = _Firestore;
export type Messaging = _Messaging;

export type firebaseConfig = _FirebaseOptions;
export type firebaseCroe = _FirebaseApp;

export class firebase {
  constructor(config = FIREBASE_CONFIG) {
    this._firebaseConfig =
      (typeof config === 'object' ? config : FIREBASE_CONFIG) ||
      FIREBASE_CONFIG;

    this.logEvent = this.logEvent.bind(this);
    this.analyticsLog = this.analyticsLog.bind(this);
    this.configUpdate = this.configUpdate.bind(this);
    this.croeServerInit = this.croeServerInit.bind(this);
    this.croeClientInit = this.croeClientInit.bind(this);
    this.croeInit = this.croeInit.bind(this);
    this.appInit = this.appInit.bind(this);
    this.appServerInit = this.appServerInit.bind(this);
    this.appClientInit = this.appClientInit.bind(this);
    this.analyticsInit = this.analyticsInit.bind(this);
    this.getNotificationPermission = this.getNotificationPermission.bind(this);
    this.requestNotificationPermission =
      this.requestNotificationPermission.bind(this);
    this.getServiceWorker = this.getServiceWorker.bind(this);
    this.registerServiceWorker = this.registerServiceWorker.bind(this);
    this.defaultSaveToken = this.defaultSaveToken.bind(this);
    this.messagingInit = this.messagingInit.bind(this);
  }
  private _MAX_INIT_TIME = 10;
  private _vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  private _firebaseConfig: FirebaseOptions | null = null;
  private _serviceWorkerScope = '/';
  private _serviceWorkerPath = '/service-worker.js';
  private _serviceWorker: ServiceWorkerRegistration | null = null;
  private _croe: FirebaseApp | null = null;
  private _croeInited = false;
  private _store: Firestore | null = null;
  private _storeInited = false;
  private _token: string | null = null;
  private _messaging: Messaging | null = null;
  private _messagingInited = false;
  private _analytics: Analytics | null = null;
  private _analyticsInited = false;

  public get firebaseConfig(): FirebaseOptions | null {
    return this._firebaseConfig;
  }
  public get serviceWorkerScope() {
    return this._serviceWorkerScope;
  }
  public get serviceWorkerPath() {
    return this._serviceWorkerPath;
  }
  public get serviceWorker() {
    return this._serviceWorker;
  }
  public get serviceWorkerInstalling() {
    return (
      typeof this._serviceWorker?.installing === 'object' &&
      this._serviceWorker?.installing !== null
    );
  }
  public get serviceWorkerActived() {
    return (
      typeof this._serviceWorker?.active === 'object' &&
      this._serviceWorker?.active !== null
    );
  }
  public get serviceWorkerWaiting() {
    return (
      typeof this._serviceWorker?.waiting === 'object' &&
      this._serviceWorker?.waiting !== null
    );
  }
  public get croe(): FirebaseApp | null {
    return this._croe;
  }
  public get croeInited() {
    return this._croeInited;
  }
  public get store(): Firestore | null {
    return this._store;
  }
  public get storeInited() {
    return this._storeInited;
  }
  public get token() {
    return this._token;
  }
  public get messaging(): Messaging | null {
    return this._messaging;
  }
  public get messagingInited() {
    return this._messagingInited;
  }
  public get analytics() {
    return {
      app: this._analytics,
      log: this.logEvent
    };
  }
  public get analyticsInited() {
    return this._analyticsInited;
  }

  public initializeApp = initializeApp;
  public initializeServerApp = initializeServerApp;
  public analyticsIsSupported = analyticsIsSupported;
  public messagingIsSupported = messagingIsSupported;
  public getFirestore = getFirestore;
  public getAnalytics = getAnalytics;
  public getToken = getToken;
  public getMessaging = getMessaging;
  public onMessage = onMessage;

  public logEvent(
    analyticsApp = this.analytics?.app,
    eventName: string,
    eventParams?: {
      [key: string]: any;
    }
  ) {
    if (typeof analyticsApp !== 'object' || analyticsApp === null) {
      console.warn('firebase analytics missing');
      return;
    }
    return logEvent(analyticsApp, eventName, eventParams);
  }
  public analyticsLog(
    eventName: string,
    eventParams?: {
      [key: string]: any;
    }
  ) {
    if (
      this.analyticsInited !== true &&
      (typeof this._analytics !== 'object' || this._analytics === null)
    ) {
      console.warn('firebase analytics missing');
      return;
    }
    return this.logEvent(this.analytics?.app, eventName, eventParams);
  }
  public async configUpdate(newConfig = null, reInit = true) {
    if (typeof newConfig !== 'object' || newConfig === null) {
      throw new Error('invalid config');
    }
    this._firebaseConfig = newConfig;

    if (reInit === true) {
      this.croeInit();
      await this.appInit();
    }
  }

  public async initializeWithServiceWorker(
    scope: string = this.serviceWorkerScope,
    serviceWorkerPath: string | null = null,
    firebaseConfig = this.firebaseConfig
  ): Promise<void> {
    if (typeof serviceWorkerPath === 'string' && serviceWorkerPath !== '') {
      await this.registerServiceWorker(scope, serviceWorkerPath);
    } else {
      await this.getServiceWorker(scope);
    }

    this._waitForServiceWorkerAndInitFirebase(firebaseConfig);
  }
  private async _waitForServiceWorkerAndInitFirebase(
    firebaseConfig = this.firebaseConfig,
    count = 0
  ): Promise<void> {
    if (count > this._MAX_INIT_TIME) {
      if (this.serviceWorkerInstalling === true) {
        this.serviceWorker?.addEventListener('activate', () =>
          this._waitForServiceWorkerAndInitFirebase(firebaseConfig)
        );
      } else {
        console.error('firebase init fail');
      }
      return;
    }

    if (this.serviceWorkerActived !== true) {
      setTimeout(
        () =>
          this._waitForServiceWorkerAndInitFirebase(firebaseConfig, count++),
        200
      );
      return;
    }
    const { firebaseCroe: croe } = this.croeInit(firebaseConfig);
    await this.appInit(croe);
  }

  // Initialize server Firebase
  public croeServerInit(firebaseConfig = this.firebaseConfig) {
    if (typeof window === 'object') return { firebaseCroe: this.croe };
    this._croeInited = false;

    try {
      if (firebaseConfig === null) throw new Error('firebaseConfig error');
      const newFirebaseCroe = this.initializeServerApp(firebaseConfig);
      this._croe = newFirebaseCroe;
    } catch (error) {
      console.error(error);
    }

    this._croeInited = true;
    return { firebaseCroe: this.croe };
  }

  // Initialize client Firebase
  public croeClientInit(firebaseConfig = this.firebaseConfig) {
    if (typeof window === 'undefined') return { firebaseCroe: this.croe };
    this._croeInited = false;

    try {
      if (firebaseConfig === null) throw new Error('firebaseConfig error');
      const newFirebaseCroe = this.initializeApp(firebaseConfig);
      this._croe = newFirebaseCroe;
    } catch (error) {
      console.error(error);
    }

    this._croeInited = true;
    return { firebaseCroe: this.croe };
  }

  // Initialize Firebase
  public croeInit(firebaseConfig = this.firebaseConfig) {
    if (typeof window === 'undefined') {
      return this.croeServerInit(firebaseConfig);
    } else {
      return this.croeClientInit(firebaseConfig);
    }
  }

  // Initialize Firebase App
  public async appInit(currentFirebaseCroe = this.croe) {
    if (typeof window === 'undefined') {
      return await this.appServerInit(currentFirebaseCroe);
    } else {
      return await this.appClientInit(currentFirebaseCroe);
    }
  }

  public appServerInit(currentFirebaseCroe = this.croe) {
    this.firestoreInit(currentFirebaseCroe);

    return { firebaseCroe: currentFirebaseCroe, store: this.store };
  }

  public async appClientInit(currentFirebaseCroe = this.croe) {
    await Promise.all([
      this.analyticsInit(currentFirebaseCroe),
      this.messagingInit(currentFirebaseCroe)
    ]);

    this.firestoreInit(currentFirebaseCroe);

    return {
      firebaseCroe: currentFirebaseCroe,
      firebaseAnalytics: this.analytics,
      firestore: this._store
    };
  }

  public firestoreInit(currentFirebaseCroe = this.croe) {
    this._storeInited = false;

    try {
      if (currentFirebaseCroe === null) throw new Error('firebaseCroe missing');
      const newFirebaseDB = this.getFirestore(currentFirebaseCroe);
      this._store = newFirebaseDB;
    } catch (error) {
      console.error(error);
    }

    this._storeInited = true;
    return this._store;
  }

  public async analyticsInit(currentFirebaseCroe = this.croe) {
    if (typeof window === 'undefined') return this.analytics;

    this._analyticsInited = false;

    const isAnalyticsSupport = await this.analyticsIsSupported();

    if (isAnalyticsSupport === false)
      console.warn('firebase analytics is not Supported');

    try {
      if (isAnalyticsSupport === true) {
        if (currentFirebaseCroe === null) {
          throw new Error('firebaseCroe missing');
        }
        const newFirebaseAnalytics = this.getAnalytics(currentFirebaseCroe);
        this._analytics = newFirebaseAnalytics;
      }

      this._analyticsInited = true;
    } catch (error) {
      console.error(error);
    }

    return this.analytics;
  }
  public getNotificationPermission() {
    if (
      typeof window === 'undefined' ||
      typeof window?.Notification === 'undefined'
    ) {
      return false;
    }
    return Notification.permission === 'granted';
  }
  public async requestNotificationPermission() {
    try {
      const isMessagingSupport = await this.messagingIsSupported();

      if (isMessagingSupport === false) {
        console.warn('FCM is not Supported');
        return false;
      }
      console.log('Requesting permission...');

      console.log({ ['Notification.permission']: Notification.permission });
      if (Notification.permission === 'granted') {
        console.log('Notification permission granted.');
        return true;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        console.log({ permission });
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          return true;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }
  public async getServiceWorker(scope = this.serviceWorkerScope) {
    if (
      'serviceWorker' in navigator &&
      typeof window.navigator.serviceWorker !== 'undefined'
    ) {
      const serviceWorker =
        await window.navigator.serviceWorker.getRegistration(scope);
      if (serviceWorker) {
        this._serviceWorkerScope = scope;
        this._serviceWorker = serviceWorker;

        return serviceWorker;
      }
    }
    // throw new Error('The browser doesn`t support service worker.');

    return null;
  }
  public async registerServiceWorker(
    scope = this.serviceWorkerScope,
    serviceWorkerPath = this.serviceWorkerPath
  ) {
    if (
      'serviceWorker' in navigator &&
      typeof window.navigator.serviceWorker !== 'undefined'
    ) {
      const serviceWorker = await window.navigator.serviceWorker.register(
        serviceWorkerPath,
        {
          scope
        }
      );

      this._serviceWorkerScope = scope;
      this._serviceWorker = serviceWorker;

      return serviceWorker;
    }
    // throw new Error('The browser doesn`t support service worker.');

    return null;
  }
  public async getOrRegisterServiceWorker(scope = this.serviceWorkerScope) {
    const serviceWorker = await this.getServiceWorker(scope);
    if (serviceWorker) return serviceWorker;

    return await this.registerServiceWorker(scope);
  }
  public async defaultSaveToken(token: string | null) {
    console.log({ token });
    return await POST_registerMessageToken({ token, os: 'web' });
  }
  public async messagingInit(
    currentFirebaseCroe = this.croe,
    saveToken = this.defaultSaveToken
  ) {
    if (typeof window === 'undefined') return this.messaging;

    const isMessagingSupport = await this.messagingIsSupported();
    if (isMessagingSupport === false) console.warn('FCM is not Supported');

    const permission = this.getNotificationPermission();
    if (permission !== true)
      console.warn('firebaseMessagingInit: Notification Permissio.');

    if (isMessagingSupport === true && permission === true) {
      this._messagingInited = false;

      try {
        const serviceWorkerRegistration = await this.getServiceWorker();

        if (
          typeof serviceWorkerRegistration === 'undefined' ||
          serviceWorkerRegistration === null
        ) {
          throw new Error("The browser doesn't support service worker.");
        }

        if (currentFirebaseCroe === null) {
          throw new Error('firebaseCroe missing');
        }
        const newFirebaseMessaging = this.getMessaging(currentFirebaseCroe);
        this._messaging = newFirebaseMessaging;

        const token = await this.getToken(newFirebaseMessaging, {
          vapidKey: this._vapidKey,
          serviceWorkerRegistration
        });
        this._token = token;

        await saveToken(token);

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

        this.onMessage(newFirebaseMessaging, (payload) => {
          try {
            // new Notification('測試', {
            //   body: payload.data?.msg,
            //   icon: '/img/favicon/favicon.ico'
            // });

            const notificationTitle =
              payload?.notification?.title || payload?.data?.title || '';
            const notificationBody =
              payload?.notification?.body || payload?.data?.msg || '';
            const notificationIcon =
              payload?.notification?.image || payload?.data?.img || '';

            serviceWorkerRegistration.showNotification(notificationTitle, {
              body: notificationBody,
              icon: notificationIcon || '/img/favicon/favicon.ico'
            });
          } catch (error) {
            console.error(error);
          }
        });

        this._messagingInited = true;

        return newFirebaseMessaging;
      } catch (error) {
        console.error(error);
      }
    }

    return this.messaging;
  }
}
// export const Firebase = new firebase();
