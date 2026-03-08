import { useSyncExternalStore, type RefObject } from 'react';

export interface ScrollPosition {
  windowScrollTop: number;
  elementScrollTop: number;
}

// Cache for server snapshot to avoid creating new objects
const SERVER_SNAPSHOT: ScrollPosition = { windowScrollTop: 0, elementScrollTop: 0 };

// Cache for client snapshots to ensure stable references when values don't change
let cachedSnapshot: ScrollPosition | null = null;

/**
 * Hook to track scroll position changes for window and optional element
 * @param elementRef - Optional ref to track element scroll
 * @returns {ScrollPosition} Current scroll positions
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const { windowScrollTop, elementScrollTop } = useScroll(ref);
 */
export function useScroll(
  elementRef?: RefObject<HTMLElement | null>
): ScrollPosition {
  return useSyncExternalStore(
    (callback) => subscribeScroll(callback, elementRef),
    () => getScrollSnapshot(elementRef),
    () => getServerScrollSnapshot()
  );
}

function subscribeScroll(
  callback: () => void,
  elementRef?: RefObject<HTMLElement | null>
) {
  function handleScroll() {
    callback();
  }

  window.addEventListener('scroll', handleScroll);
  
  const element = elementRef?.current?.parentElement;
  if (element) {
    element.addEventListener('scroll', handleScroll);
  }

  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (element) {
      element.removeEventListener('scroll', handleScroll);
    }
  };
}

function getScrollSnapshot(
  elementRef?: RefObject<HTMLElement | null>
): ScrollPosition {
  const windowScrollTop =
    typeof window !== 'undefined'
      ? Math.max(
          document.body.scrollTop || 0,
          document.documentElement.scrollTop || 0
        )
      : 0;

  const elementScrollTop =
    elementRef?.current?.parentElement?.scrollTop || 0;

  // ✅ FIXED: Cache snapshot to avoid creating new objects when values haven't changed
  // This prevents infinite loop in useSyncExternalStore
  if (
    cachedSnapshot &&
    cachedSnapshot.windowScrollTop === windowScrollTop &&
    cachedSnapshot.elementScrollTop === elementScrollTop
  ) {
    return cachedSnapshot;
  }

  // Update cache
  cachedSnapshot = { windowScrollTop, elementScrollTop };
  
  return cachedSnapshot;
}

function getServerScrollSnapshot(): ScrollPosition {
  // ✅ FIXED: Return cached constant to avoid infinite loop
  return SERVER_SNAPSHOT;
}

export default useScroll;
