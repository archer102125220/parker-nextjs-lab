'use client';
import type { ReactNode } from 'react';

import { googleGAInit } from '@/utils/third-party/ga';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

interface GAInitProps {
  gaId: string;
  debug?: boolean;
  log?: boolean;
  children?: ReactNode;
}

const isDev = process.env.NODE_ENV === 'development';

export function GAInit({ children, gaId, debug, log }: GAInitProps) {
  useIsomorphicLayoutEffect(() => {
    const _debug = typeof debug === 'boolean' ? debug : isDev;
    const _log = typeof log === 'boolean' ? log : isDev;

    googleGAInit(gaId, _debug, _log);
  }, [gaId, debug, log]);

  return children;
}

export default GAInit;
