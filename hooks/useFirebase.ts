import { useSyncExternalStore } from 'react';

import type { firebaseConfig, Firestore } from '@/utils/third-party/firebase';
import { firebase } from '@/utils/third-party/firebase';

export type useFirebaseType = firebase | Firestore | null | undefined;

export function useFirebaseInit(
  config: firebaseConfig,
  scope: string = '/',
  callback?: (firebase?: firebase) => void
): useFirebaseType {
  if (subscribeFirebase.Firebase instanceof firebase === false) {
    if (typeof config === 'object' && config !== null) {
      // TODO: Fix side-effect triggering issues
      // eslint-disable-next-line react-hooks/immutability
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
      // TODO: Fix side-effect triggering issues
      // eslint-disable-next-line react-hooks/immutability
      subscribeFirebase.firebaseInited = true;
    }
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
      // TODO: Fix side-effect triggering issues
      // eslint-disable-next-line react-hooks/immutability
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
      // TODO: Fix side-effect triggering issues
      // eslint-disable-next-line react-hooks/immutability
      subscribeFirebase.firebaseInited = true;
    }
  }

  return useSyncExternalStore<useFirebaseType>(
    subscribeFirebase.subscribe,
    subscribeFirebase.getSnapshot,
    subscribeFirebase.getServerSnapshot
  );
}

class FirebaseSubscription {
  Firebase: firebase | null = null;
  firebaseInited: boolean = false;

  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.getServerSnapshot = this.getServerSnapshot.bind(this);
  }

  subscribe() {
    return () => {};
  }

  getSnapshot() {
    return this.Firebase;
  }

  getServerSnapshot() {
    return this.Firebase?.store;
  }
}

const subscribeFirebase = new FirebaseSubscription();

export default useFirebase;
