'use server';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { storeInit } from '@/store';
import { ClientProvider } from '@/components/ClientProvider';

type ReduxInitProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function ReduxInit({ children, params }: ReduxInitProps): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const systemName = t('systemName');

  // 在伺服器端創建 store 並設置初始狀態
  const serverStore = storeInit();
  serverStore.dispatch({ type: 'system/setSystemName', payload: systemName });
  const initialState = serverStore.getState();

  return (
    <ClientProvider initialState={initialState}>{children}</ClientProvider>
  );
}

export default ReduxInit;