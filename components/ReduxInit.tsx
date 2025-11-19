'use server';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { storeInit } from '@/store';
import { ClientProvider } from '@/components/ClientProvider';

type ReduxInitProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
  nonce?: string;
};

export async function ReduxInit({
  children,
  params,
  nonce
}: ReduxInitProps): Promise<ReactNode> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const systemName = t('systemName');

  // console.log(JSON.stringify({ ReduxInitNonce: nonce }));

  // 在伺服器端創建 store 並設置初始狀態
  const serverStore = storeInit();
  serverStore.dispatch({ type: 'system/setSystemName', payload: systemName });
  serverStore.dispatch({ type: 'system/setNonce', payload: nonce || '' });
  const initialState = serverStore.getState();

  // console.log(JSON.stringify({ ReduxInitInitialState: initialState }));

  return (
    <ClientProvider initialState={initialState}>{children}</ClientProvider>
  );
}

export default ReduxInit;
