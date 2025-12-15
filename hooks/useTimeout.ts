import { useEffect, useRef } from 'react';

/**
 * Hook to execute a callback after a delay
 * @param callback - Function to execute
 * @param delay - Delay in milliseconds (null to pause)
 * 
 * @example
 * useTimeout(() => console.log('Executed after 1 second'), 1000);
 * useTimeout(() => showMessage(), isActive ? 3000 : null);
 */
export function useTimeout(
  callback: () => void,
  delay: number | null
): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return;
    }

    const id = setTimeout(() => savedCallback.current(), delay);

    return () => clearTimeout(id);
  }, [delay]);
}

export default useTimeout;
