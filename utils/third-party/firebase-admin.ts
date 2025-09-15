import firebaseAdmin from 'firebase-admin';

// https://firebase.google.com/docs/cloud-messaging/migrate-v1?authuser=0&_gl=11yc83x4_gaMTMzNDU0MDY5LjE2ODYxMDI5NzQ._ga_CW55HF8NVT*MTY5NDY3NzAxMy4yNC4xLjE2OTQ2NzgxODEuMC4wLjA.&hl=zh-tw#linux-or-macos
// https://firebase.google.com/docs/cloud-messaging/js/client?hl=zh-tw#web
// https://firebase.google.com/docs/cloud-messaging/js/client?hl=zh-tw#web_2

export type firebaseAdminAppType = firebaseAdmin.app.App;

export const CREDENTIAL = process.env.NEXT_PUBLIC_FIREBASE_CREDENTIAL || '{}';

export const FIREBASE_ADMIN_CONFIG = {
  authDomain: 'parker-nextjs-lab.firebaseapp.com',
  projectId: 'parker-nextjs-lab',
  storageBucket: 'parker-nextjs-lab.firebasestorage.app'
};

export let firebaseAdminWeb: firebaseAdminAppType | null = null;
export function getFirebaseAdminWeb() {
  return firebaseAdminWeb;
}

export const ANDROID_CREDENTIAL =
  process.env.NEXT_PUBLIC_ANDROID_FIREBASE_CREDENTIAL || '{}';

export const ANDROID_FIREBASE_ADMIN_CONFIG = {
  authDomain: 'httpsbibiancojp.firebaseapp.com',
  projectId: 'httpsbibiancojp',
  storageBucket: 'httpsbibiancojp.appspot.com'
};
export let firebaseAdminAndroid: firebaseAdminAppType | null = null;
export function getFirebaseAdminAndroid() {
  return firebaseAdminAndroid;
}

export const IOS_CREDENTIAL =
  process.env.NEXT_PUBLIC_IOS_FIREBASE_CREDENTIAL || '{}';

export const IOS_FIREBASE_ADMIN_CONFIG = {
  authDomain: 'httpsbibiancojp.firebaseapp.com',
  projectId: 'httpsbibiancojp',
  storageBucket: 'httpsbibiancojp.appspot.com'
};
export let firebaseAdminIos: firebaseAdminAppType | null = null;
export function getFirebaseAdminIos() {
  return firebaseAdminIos;
}

export function getFirebaseAdmin(
  name = '[DEFAULT]'
): firebaseAdminAppType | null {
  let firebaseAdminApp = null;
  try {
    firebaseAdminApp = firebaseAdmin.app(name);
  } catch (error) {
    console.error(error);
  }
  return firebaseAdminApp;
}

export function firebaseAdminServerInit() {
  try {
    if (typeof window !== 'undefined') return;

    if (getFirebaseAdmin('[DEFAULT]')) {
      firebaseAdminWeb = getFirebaseAdmin('[DEFAULT]');
    } else if (
      typeof CREDENTIAL === 'string' &&
      CREDENTIAL !== '{}' &&
      CREDENTIAL !== ''
    ) {
      firebaseAdminWeb = firebaseAdmin.initializeApp({
        ...FIREBASE_ADMIN_CONFIG,
        credential: firebaseAdmin.credential.cert(JSON.parse(CREDENTIAL))
      });
    }

    if (getFirebaseAdmin('androidFirebaseAdmin')) {
      firebaseAdminAndroid = getFirebaseAdmin('androidFirebaseAdmin');
    } else if (
      typeof ANDROID_CREDENTIAL === 'string' &&
      ANDROID_CREDENTIAL !== '{}' &&
      ANDROID_CREDENTIAL !== ''
    ) {
      firebaseAdminAndroid = firebaseAdmin.initializeApp(
        {
          ...ANDROID_FIREBASE_ADMIN_CONFIG,
          credential: firebaseAdmin.credential.cert(
            JSON.parse(ANDROID_CREDENTIAL)
          )
        },
        'androidFirebaseAdmin'
      );
    }

    if (getFirebaseAdmin('iosFirebaseAdmin')) {
      firebaseAdminIos = getFirebaseAdmin('iosFirebaseAdmin');
    } else if (
      typeof IOS_CREDENTIAL === 'string' &&
      IOS_CREDENTIAL !== '{}' &&
      IOS_CREDENTIAL !== ''
    ) {
      firebaseAdminIos = firebaseAdmin.initializeApp(
        {
          ...IOS_FIREBASE_ADMIN_CONFIG,
          credential: firebaseAdmin.credential.cert(JSON.parse(IOS_CREDENTIAL))
        },
        'iosFirebaseAdmin'
      );
    }
  } catch (error) {
    console.error(error);
  }

  if (typeof firebaseAdminWeb !== 'object' || firebaseAdminWeb === null) {
    console.warn('Firebase Admin app initialization failed.');
  }

  if (
    typeof firebaseAdminAndroid !== 'object' ||
    firebaseAdminAndroid === null
  ) {
    console.warn('Android Firebase Admin app initialization failed.');
  }

  if (typeof firebaseAdminIos !== 'object' || firebaseAdminIos === null) {
    console.warn('IOS Firebase Admin app initialization failed.');
  }

  return { firebaseAdminWeb, firebaseAdminAndroid, firebaseAdminIos };
}

// https://ithelp.ithome.com.tw/articles/10269342
// https://vercel.com/archer102125220/resume-web

firebaseAdminServerInit();
