'use client';
import { useLayoutEffect, type ReactNode } from 'react';

import { googleGAInit } from '@/utils/third-party/ga';

interface GAInitProps {
  gaId: string;
  nonce?: string;
  debug?: boolean;
  log?: boolean;
  children?: ReactNode;
}

const isDev = process.env.NODE_ENV === 'development';

export function GAInit({
  children,
  gaId,
  nonce,
  debug,
  log
}: GAInitProps): ReactNode {
  useLayoutEffect(() => {
    const _debug = typeof debug === 'boolean' ? debug : isDev;
    const _log = typeof log === 'boolean' ? log : isDev;

    googleGAInit(gaId, nonce, _debug, _log);
  }, [gaId, nonce, debug, log]);

  return children;
}

export default GAInit;
