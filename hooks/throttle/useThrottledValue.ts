import { useEffect, useRef, useState } from 'react';

export function useThrottledValue<T>(value: T, wait: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRanRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (lastRanRef.current === 0 || now - lastRanRef.current >= wait) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThrottledValue(value);
      lastRanRef.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(
        () => {
          setThrottledValue(value);
          lastRanRef.current = Date.now();
          timeoutRef.current = null;
        },
        wait - (now - lastRanRef.current)
      );
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, wait]);

  return throttledValue;
}
