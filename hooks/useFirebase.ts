import { useSyncExternalStore } from 'react';

import type { firebaseConfig, Firestore } from '@/utils/third-party/firebase';
import { firebase } from '@/utils/third-party/firebase';

export type useFirebaseType = firebase | Firestore | null | undefined;

export function useFirebaseInit(
  config: firebaseConfig,
  scope: string = '/'
): useFirebaseType {
  subscribeFirebase.Firebase = new firebase(config);

  subscribeFirebase.Firebase.initializeWithServiceWorker(scope);

  return useFirebase(config, scope);
}
export function useFirebase(
  config?: firebaseConfig,
  scope: string = '/'
): useFirebaseType {
  if (subscribeFirebase.Firebase instanceof firebase === false) {
    if (typeof config === 'object' && config !== null) {
      subscribeFirebase.Firebase = new firebase(config);
    } else {
      throw new Error('missing Firebase');
    }

    subscribeFirebase.Firebase.initializeWithServiceWorker(scope);
  }

  return useSyncExternalStore<useFirebaseType>(
    subscribeFirebase.subscribe,
    subscribeFirebase.getSnapshot,
    subscribeFirebase.getServerSnapshot
  );
}

type subscribeFirebaseType = {
  Firebase: firebase | null;
  subscribe: () => () => void | undefined;
  getSnapshot: () => firebase | null | undefined;
  getServerSnapshot: () => firebase | Firestore | null | undefined;
};
const subscribeFirebase: subscribeFirebaseType = {
  Firebase: null,
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
