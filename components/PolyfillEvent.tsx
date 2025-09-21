'use client';
import type { ReactNode } from 'react';

import { handlePolyfillScrollEnd } from '@/utils/polyfill/scroll-end';

type PolyfillEventProps = {
  children?: ReactNode;
};

export function PolyfillEvent({ children }: PolyfillEventProps): ReactNode {
  handlePolyfillScrollEnd();

  return children;
}

export default PolyfillEvent;
