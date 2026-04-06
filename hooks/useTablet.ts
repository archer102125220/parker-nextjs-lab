import { useSyncExternalStore } from 'react';

import scssVariable from '@/styles/scss_variable_export.module.scss';

export function useTablet() {
  return useSyncExternalStore(
    subscribeTabletStatus.subscribe,
    subscribeTabletStatus.getSnapshot,
    subscribeTabletStatus.getServerSnapshot
  );
}

let isTablet =
  typeof window !== 'undefined'
    ? window.matchMedia(`(max-width: ${scssVariable.tabletMaxWidth})`).matches
    : false;

const subscribeTabletStatus = {
  subscribe() {
    function windowWidthListener() {
      isTablet = window.matchMedia(`(max-width: ${scssVariable.tabletMaxWidth})`).matches;
    }
    window.addEventListener('resize', windowWidthListener);
    return () => {
      window.removeEventListener('resize', windowWidthListener);
    };
  },
  getSnapshot() {
    return isTablet;
  },
  getServerSnapshot() {
    return isTablet;
  }
};

export default useTablet;
