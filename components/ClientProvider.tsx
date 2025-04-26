'use client';

import { Provider } from 'react-redux';
import { storeInit } from '@/store';
import type { RootState } from '@/store';

type ProvidersProps = {
  children: React.ReactNode;
  initialState?: RootState;
};

export function ClientProvider({ children, initialState }: ProvidersProps) {
  const store = storeInit(initialState);

  return <Provider store={store}>{children}</Provider>;
}
