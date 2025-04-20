'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setSystemName } from '@/store/slices/systemSlice';

interface ReduxInitializerProps {
  systemName: string;
}

export default function ReduxInitializer({ systemName }: ReduxInitializerProps) {
  const dispatch = useAppDispatch();

  // 只在客戶端更新 systemName
  useEffect(() => {
    if (typeof window !== 'undefined') {
      dispatch(setSystemName(systemName));
    }
  }, [dispatch, systemName]);

  return null;
} 