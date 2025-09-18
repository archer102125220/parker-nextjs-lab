'use client';
import type { ReactNode } from 'react';

import type { firebaseConfig } from '@/utils/third-party/firebase';
import { useFirebaseInit } from '@/hooks/useFirebase';
export interface FirebaseInitProps extends firebaseConfig {
  children?: ReactNode;
}

export async function FirebaseInit(
  props: FirebaseInitProps
): Promise<ReactNode> {
  const { children, ...firebaseConfig } = props;

  useFirebaseInit(firebaseConfig, '/');

  return children;
}

export default FirebaseInit;
