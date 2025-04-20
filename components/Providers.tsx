'use client';

import { Provider } from 'react-redux';
import { createServerStore } from '@/store/createServerStore';

export function Providers({
  children,
  initialState
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any;
}) {
  const store = createServerStore(initialState);

  return <Provider store={store}>{children}</Provider>;
}
