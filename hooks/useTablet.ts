import { useSyncExternalStore } from 'react';

import { mediaTablet } from '@/styles/mediaQuery';

export function useTablet() {
  return useSyncExternalStore(
    subscribeTabletStatus.subscribe,
    subscribeTabletStatus.getSnapshot,
    subscribeTabletStatus.getServerSnapshot
  );
}

let isTablet =
  typeof window !== 'undefined'
    ? window.matchMedia(mediaTablet.replace('@media', '')).matches
    : false;

const subscribeTabletStatus = {
  subscribe() {
    function windowWidthListener() {
      isTablet = window.matchMedia(mediaTablet.replace('@media', '')).matches;
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

