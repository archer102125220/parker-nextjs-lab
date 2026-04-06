import { useSyncExternalStore } from 'react';

import scssVariable from '@/styles/scss_variable_export.module.scss';

export function useMobile() {
  return useSyncExternalStore(
    subscribeMobileStatus.subscribe,
    subscribeMobileStatus.getSnapshot,
    subscribeMobileStatus.getServerSnapshot
  );
}

let isMobile =
  typeof window !== 'undefined'
    ? window.matchMedia(`(max-width: ${scssVariable.mobileMaxWidth})`).matches
    : false;

const subscribeMobileStatus = {
  subscribe() {
    function windowWidthListener() {
      isMobile = window.matchMedia(`(max-width: ${scssVariable.mobileMaxWidth})`).matches;
    }
    window.addEventListener('resize', windowWidthListener);
    return () => {
      window.removeEventListener('resize', windowWidthListener);
    };
  },
  getSnapshot() {
    return isMobile;
  },
  getServerSnapshot() {
    return isMobile;
  }
};

export default useMobile;
