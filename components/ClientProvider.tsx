'use client';

import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import type { RootState } from '@/store';
import { storeInit } from '@/store';

type ProvidersProps = {
  children: React.ReactNode;
  initialState?: RootState;
};

export function ClientProvider({ children, initialState }: ProvidersProps): ReactNode {
  const store = storeInit(initialState);

  return <Provider store={store}>{children}</Provider>;
}

export default ClientProvider;