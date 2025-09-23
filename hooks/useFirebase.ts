import { useSyncExternalStore } from 'react';

import type { firebaseConfig, Firestore } from '@/utils/third-party/firebase';
import { firebase } from '@/utils/third-party/firebase';

export type useFirebaseType = firebase | Firestore | null | undefined;

export function useFirebaseInit(
  config: firebaseConfig,
  scope: string = '/',
  callback?: (firebase?: firebase) => void
): useFirebaseType {
  subscribeFirebase.Firebase = new firebase(config);

  if (subscribeFirebase.firebaseInited === false) {
    subscribeFirebase.Firebase.initializeWithServiceWorker(
      scope,
      null,
      null,
      callback
    );
    subscribeFirebase.firebaseInited = true;
  }

  return useFirebase(config, scope, callback);
}
export function useFirebase(
  config?: firebaseConfig,
  scope: string = '/',
  callback?: (firebase?: firebase) => void
): useFirebaseType {
  if (subscribeFirebase.Firebase instanceof firebase === false) {
    if (typeof config === 'object' && config !== null) {
      subscribeFirebase.Firebase = new firebase(config);
    } else {
      throw new Error('missing Firebase');
    }

    if (subscribeFirebase.firebaseInited === false) {
      subscribeFirebase.Firebase.initializeWithServiceWorker(
        scope,
        null,
        null,
        callback
      );
      subscribeFirebase.firebaseInited = true;
    }
  }

  return useSyncExternalStore<useFirebaseType>(
    subscribeFirebase.subscribe,
    subscribeFirebase.getSnapshot,
    subscribeFirebase.getServerSnapshot
  );
}

type subscribeFirebaseType = {
  Firebase: firebase | null;
  firebaseInited: boolean;
  subscribe: () => () => void | undefined;
  getSnapshot: () => firebase | null | undefined;
  getServerSnapshot: () => firebase | Firestore | null | undefined;
};
const subscribeFirebase: subscribeFirebaseType = {
  Firebase: null,
  firebaseInited: false,
  subscribe() {
    return () => {};
  },
  getSnapshot() {
    return subscribeFirebase.Firebase;
  },
  getServerSnapshot() {
    return subscribeFirebase.Firebase?.store;
  }
};

export default useFirebase;
