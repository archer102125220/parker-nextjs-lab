'use client';
import { memo, type ReactNode } from 'react';

import { handlePolyfillScrollEnd } from '@/utils/polyfill/scroll-end';
import { handleFindLastIndexPolyfill } from '@/utils/polyfill/array-find-last-index-polyfill';
import { initialize as handleLargeSmallDynamicViewportUnitsPolyfill } from '@/utils/polyfill/large-small-dynamic-viewport-units-polyfill';

type PolyfillEventProps = {
  children?: ReactNode;
  scrollEndWait?: number;
  dvhIsThrottle?: boolean;
};

export const PolyfillEvent = memo(({
  scrollEndWait = 100,
  dvhIsThrottle = true,
  children = null
}: PolyfillEventProps): ReactNode => {
  handlePolyfillScrollEnd(scrollEndWait);
  handleFindLastIndexPolyfill();
  handleLargeSmallDynamicViewportUnitsPolyfill(dvhIsThrottle);
  if (typeof window !== 'undefined') {
    import('mdn-polyfills/Node.prototype.replaceWith').then(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Node.prototype.replaceWith polyfill success');
      }
    }).catch(error => {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    });
  }

  return children;
})
PolyfillEvent.displayName = 'PolyfillEvent';

export default PolyfillEvent;
