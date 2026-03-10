import { useCallback, useEffect, useRef } from 'react';

export function useThrottleFn<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number = 500
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);
  const lastRanRef = useRef<number>(0);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    lastRanRef.current = 0;
  }, []);

  const run = useCallback(
    (...args: Args) => {
      const now = Date.now();

      if (lastRanRef.current === 0 || now - lastRanRef.current >= wait) {
        // Leading edge: run immediately if enough time has passed
        fnRef.current(...args);
        lastRanRef.current = now;
      } else {
        // Trailing edge: schedule a run if we're within the wait period
        cancel();
        timeoutRef.current = setTimeout(
          () => {
            fnRef.current(...args);
            lastRanRef.current = Date.now();
            timeoutRef.current = null;
          },
          wait - (now - lastRanRef.current)
        );
      }
    },
    [wait, cancel]
  );

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { run, cancel };
}
