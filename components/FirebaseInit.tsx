'use client';
import type { ReactNode } from 'react';

import type { firebaseConfig } from '@/utils/third-party/firebase';
import useFirebase from '@/hooks/useFirebase';

export interface FirebaseInitProps extends firebaseConfig {
  children?: ReactNode;
}

export function FirebaseInit(props: FirebaseInitProps): ReactNode {
  const { children, ...firebaseConfig } = props;

  useFirebase(firebaseConfig);

  return children;
}

export default FirebaseInit;
