import { useEffect, useRef, useCallback } from 'react';

export interface UseThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * useThrottle Hook
 * 
 * 節流函數調用,在指定時間內只執行一次
 * 
 * @param callback - 要節流的回調函數
 * @param delay - 節流延遲時間(毫秒)
 * @param options - 配置選項
 * @returns 節流後的函數
 * 
 * @example
 * ```tsx
 * const handleScroll = useThrottle(() => {
 *   console.log('Scrolling...');
 * }, 500);
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', handleScroll);
 *   return () => window.removeEventListener('scroll', handleScroll);
 * }, [handleScroll]);
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: UseThrottleOptions = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options;
  
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const throttledFunction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      lastArgsRef.current = args;

      // Leading edge
      if (leading && timeSinceLastRun >= delay) {
        lastRun.current = now;
        callback(...args);
        return;
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Trailing edge
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          if (lastArgsRef.current) {
            callback(...lastArgsRef.current);
          }
        }, delay - timeSinceLastRun);
      }
    },
    [callback, delay, leading, trailing]
  );

  return throttledFunction;
}

export default useThrottle;
