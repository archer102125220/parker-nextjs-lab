import { useCallback, useEffect, useRef } from 'react';

export function useDebounceFn<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number = 500
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const run = useCallback(
    (...args: Args) => {
      cancel();
      timeoutRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay, cancel]
  );

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return { run, cancel };
}
