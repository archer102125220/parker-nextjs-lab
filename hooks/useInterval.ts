import { useEffect, useEffectEvent } from 'react';

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
  // Use useEffectEvent for stable callback
  const onTick = useEffectEvent(() => {
    callback();
  });

  // Set up the interval
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return;
    }

    const id = setInterval(() => onTick(), delay);

    return () => clearInterval(id);
  }, [delay]); // onTick is stable
}

export default useInterval;
