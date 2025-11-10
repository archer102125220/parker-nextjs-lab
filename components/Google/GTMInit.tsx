'use client';
import type { ReactNode } from 'react';
import { useState, useLayoutEffect, useEffect } from 'react';

import { googleGTMInit } from '@/utils/third-party/gtm';

interface GTMInitProps {
  gtmId: string;
  nonce?: string;
  log?: boolean;
  children?: ReactNode;
}

const isDev = process.env.NODE_ENV === 'development';

export function GTMInit({
  children,
  nonce,
  gtmId,
  log
}: GTMInitProps): ReactNode {
  const [clientNonce, setClientNonce] = useState<string>('');

  useLayoutEffect(() => {
    const _log = typeof log === 'boolean' ? log : isDev;

    googleGTMInit(gtmId, nonce, _log);
  }, [gtmId, nonce, log]);

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          nonce={clientNonce}
        />
      </noscript>
      {children}
    </>
  );
}

export default GTMInit;
