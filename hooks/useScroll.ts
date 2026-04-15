import { useRef, useSyncExternalStore, type RefObject } from 'react';

export interface ScrollPosition {
  windowScrollTop: number;
  elementScrollTop: number;
}

// Cache for server snapshot to avoid creating new objects
const SERVER_SNAPSHOT: ScrollPosition = { windowScrollTop: 0, elementScrollTop: 0 };

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
  // snapshot cache 必須是每個 hook instance 各自持有；
  // 若共用模組層級快取，多個 GoTop / ScrollFetch 會互相覆寫，進而讓 useSyncExternalStore 持續重算。
  const cachedSnapshotRef = useRef<ScrollPosition>(SERVER_SNAPSHOT);

  return useSyncExternalStore(
    (callback) => subscribeScroll(callback, elementRef),
    () => getScrollSnapshot(elementRef, cachedSnapshotRef),
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
  elementRef: RefObject<HTMLElement | null> | undefined,
  cachedSnapshotRef: RefObject<ScrollPosition>
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

  // useSyncExternalStore 要求底層值沒變時，必須回傳相同的 snapshot reference，否則會被視為 store 持續更新。
  if (
    cachedSnapshotRef.current.windowScrollTop === windowScrollTop &&
    cachedSnapshotRef.current.elementScrollTop === elementScrollTop
  ) {
    return cachedSnapshotRef.current;
  }

  cachedSnapshotRef.current = { windowScrollTop, elementScrollTop };

  return cachedSnapshotRef.current;
}

function getServerScrollSnapshot(): ScrollPosition {
  // ✅ FIXED: Return cached constant to avoid infinite loop
  return SERVER_SNAPSHOT;
}

export default useScroll;
