'use client';
import type { ReactNode } from 'react';

import type { firebaseConfig } from '@/utils/third-party/firebase';
import { firebase } from '@/utils/third-party/firebase';
import { useFirebaseInit } from '@/hooks/useFirebase';

import { useAppDispatch } from '@/store';

export interface FirebaseInitProps extends firebaseConfig {
  children?: ReactNode;
}

export function FirebaseInit(props: FirebaseInitProps): ReactNode {
  const { children, ...firebaseConfig } = props;

  const dispatch = useAppDispatch();

  useFirebaseInit(firebaseConfig, '/', (Firebase) => {
    // console.log('useFirebaseInit/callback');

    if (Firebase instanceof firebase === true) {
      dispatch({
        type: 'system/setAgreeNotification',
        payload: Firebase.getNotificationPermission()
      });
    }
    dispatch({ type: 'system/setFirebaseCroeInited', payload: true });
  });

  return children;
}

export default FirebaseInit;
