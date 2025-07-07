'use client';
import type { ReactNode } from 'react';
import _debounce from 'lodash/debounce';

import { googleGAInit } from '@/utils/third-party/ga';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

interface GAInitProps {
  gaId: string;
  debug?: boolean;
  log?: boolean;
  children?: ReactNode;
}

const isDev = process.env.NODE_ENV === 'development';
const debounceGoogleGAInit = _debounce(googleGAInit, 100);

export function GAInit({ children, gaId, debug, log }: GAInitProps) {
  useIsomorphicLayoutEffect(() => {
    const _debug = typeof debug === 'boolean' ? debug : isDev;
    const _log = typeof log === 'boolean' ? log : isDev;

    debounceGoogleGAInit(gaId, _debug, _log);
  }, [gaId, debug, log]);

  return children;
}

export default GAInit;
