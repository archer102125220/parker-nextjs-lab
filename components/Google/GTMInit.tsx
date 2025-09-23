'use client';
import { useLayoutEffect, type ReactNode } from 'react';

import { googleGTMInit } from '@/utils/third-party/gtm';

interface GTMInitProps {
  gtmId: string;
  log?: boolean;
  children?: ReactNode;
}

const isDev = process.env.NODE_ENV === 'development';

export function GTMInit({ children, gtmId, log }: GTMInitProps): ReactNode {
  useLayoutEffect(() => {
    const _log = typeof log === 'boolean' ? log : isDev;

    googleGTMInit(gtmId, _log);
  }, [gtmId, log]);

  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      {children}
    </>
  );
}

export default GTMInit;
