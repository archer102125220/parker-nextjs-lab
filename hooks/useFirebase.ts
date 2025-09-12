import { useSyncExternalStore } from 'react';

import { firebase } from '@/utils/third-party/firebase';
import type { firebaseConfig, Firestore } from '@/utils/third-party/firebase';

export function useFirebaseInit(config: firebaseConfig) {
  subscribeFirebase.Firebase = new firebase(config);
  return useFirebase();
}
export function useFirebase(config?: firebaseConfig) {
  if (subscribeFirebase.Firebase instanceof firebase === false) {
    if (typeof config === 'object' && config !== null) {
      subscribeFirebase.Firebase = new firebase(config);
    } else {
      throw new Error('missing Firebase');
    }
  }
  return useSyncExternalStore(
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
