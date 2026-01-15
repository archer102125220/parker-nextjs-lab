import { useSyncExternalStore } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

/**
 * Hook to track window size changes
 * @returns {WindowSize} Current window width and height
 * 
 * @example
 * const { width, height } = useWindowSize();
 * console.log(`Window size: ${width}x${height}`);
 */
export function useWindowSize(): WindowSize {
  return useSyncExternalStore(
    subscribeWindowSize.subscribe,
    subscribeWindowSize.getSnapshot,
    subscribeWindowSize.getServerSnapshot
  );
}

let windowSize: WindowSize =
  typeof window !== 'undefined'
    ? { width: window.innerWidth, height: window.innerHeight }
    : { width: 0, height: 0 };

const subscribeWindowSize = {
  subscribe(callback: () => void) {
    function handleResize() {
      windowSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      callback();
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },
  getSnapshot(): WindowSize {
    return windowSize;
  },
  getServerSnapshot(): WindowSize {
    return { width: 0, height: 0 };
  }
};

export default useWindowSize;

