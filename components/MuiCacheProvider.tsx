'use client';
import { useMemo, type ReactNode } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export interface MuiCacheProviderProps {
  children: ReactNode;
  nonce?: string;
}

export function MuiCacheProvider({ children, nonce }: MuiCacheProviderProps) {
  // console.log(JSON.stringify({ MuiCacheProviderNonce: nonce }));

  const clientNonce = useMemo(
    () => (typeof nonce === 'string' && nonce !== '' ? nonce : ''),
    [nonce]
  );

  return (
    <AppRouterCacheProvider options={{ nonce: clientNonce }}>
      {children}
    </AppRouterCacheProvider>
  );
}

export default MuiCacheProvider;
