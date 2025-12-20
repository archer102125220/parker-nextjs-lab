import { useEffect, useRef } from 'react';

/**
 * Hook to execute a callback at regular intervals
 * @param callback - Function to execute
 * @param delay - Interval delay in milliseconds (null to pause)
 * 
 * @example
 * useInterval(() => setCount(c => c + 1), 1000);
 * useInterval(() => fetchData(), isRunning ? 5000 : null);
 */
export function useInterval(
  callback: () => void,
  delay: number | null
): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

export default useInterval;
