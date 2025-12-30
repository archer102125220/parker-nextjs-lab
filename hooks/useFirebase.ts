import { useSyncExternalStore } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import type { firebaseConfig, Firestore } from '@/utils/third-party/firebase';
import { firebase } from '@/utils/third-party/firebase';

export type useFirebaseType = firebase | Firestore | null | undefined;

export function useFirebaseInit(
  config: firebaseConfig,
  scope: string = '/',
  callback?: (firebase?: firebase) => void
): useFirebaseType {
  useIsomorphicLayoutEffect(() => {
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
  }, [config, scope, callback]);

  return useFirebase(config, scope, callback);
}
export function useFirebase(
  config?: firebaseConfig,
  scope: string = '/',
  callback?: (firebase?: firebase) => void
): useFirebaseType {
  useIsomorphicLayoutEffect(() => {
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
  }, [config, scope, callback]);

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
