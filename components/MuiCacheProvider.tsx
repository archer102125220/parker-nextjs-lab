'use client';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
// import { CacheProvider } from '@emotion/react';
// import createEmotionCache from '@emotion/cache';

export interface MuiCacheProviderProps {
  children: ReactNode;
  nonce?: string;
}

export function MuiCacheProvider({ children, nonce }: MuiCacheProviderProps) {
  // console.log(JSON.stringify({ MuiCacheProviderNonce: nonce }));

  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  // return (
  //   <AppRouterCacheProvider
  //     CacheProvider={() => (
  //       <CacheProvider
  //         value={createEmotionCache({
  //           key: 'my-prefix-key',
  //           nonce: clientNonce,
  //           prepend: true
  //         })}
  //       />
  //     )}
  //   >
  //     {children}
  //   </AppRouterCacheProvider>
  // );
  return (
    <AppRouterCacheProvider options={{ nonce: clientNonce }}>
      {children}
    </AppRouterCacheProvider>
  );
}

export default MuiCacheProvider;
