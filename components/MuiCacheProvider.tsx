'use client';
import type { ReactNode } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
// import { CacheProvider } from '@emotion/react';
// import createEmotionCache from '@emotion/cache';

export interface MuiCacheProviderProps {
  children: ReactNode;
  nonce?: string;
}

export function MuiCacheProvider({ children, nonce }: MuiCacheProviderProps) {
  console.log(JSON.stringify({ MuiCacheProviderNonce: nonce }));

  // return (
  //   <AppRouterCacheProvider
  //     CacheProvider={() => (
  //       <CacheProvider
  //         value={createEmotionCache({
  //           key: 'my-prefix-key',
  //           nonce: nonce,
  //           prepend: true
  //         })}
  //       />
  //     )}
  //   >
  //     {children}
  //   </AppRouterCacheProvider>
  // );
  return (
    <AppRouterCacheProvider options={{ nonce }}>
      {children}
    </AppRouterCacheProvider>
  );
}

export default MuiCacheProvider;
