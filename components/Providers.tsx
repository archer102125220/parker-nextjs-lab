'use client';

import { Provider } from 'react-redux';
import { makeStore } from '@/store';

export function Providers({
  children,
  initialState
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any;
}) {
  const store = makeStore(initialState);

  return <Provider store={store}>{children}</Provider>;
}
