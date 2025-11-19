'use client';
import type { ReactNode } from 'react';

import { handlePolyfillScrollEnd } from '@/utils/polyfill/scroll-end';
import { handleFindLastIndexPolyfill } from '@/utils/polyfill/array-find-last-index-polyfill';
import { initialize as handleLargeSmallDynamicViewportUnitsPolyfill } from '@/utils/polyfill/large-small-dynamic-viewport-units-polyfill';

type PolyfillEventProps = {
  children?: ReactNode;
  scrollEndWait?: number;
  dvhIsThrottle?: boolean;
};

export function PolyfillEvent({
  scrollEndWait = 100,
  dvhIsThrottle = true,
  children
}: PolyfillEventProps): ReactNode {
  handlePolyfillScrollEnd(scrollEndWait);
  handleFindLastIndexPolyfill();
  handleLargeSmallDynamicViewportUnitsPolyfill(dvhIsThrottle);

  return children;
}

export default PolyfillEvent;
