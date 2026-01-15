import { useEffect, useEffectEvent } from 'react';

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
  // Use useEffectEvent for stable callback
  const onTimeout = useEffectEvent(() => {
    callback();
  });

  // Set up the timeout
  useEffect(() => {
    // Don't schedule if no delay is specified
    if (delay === null) {
      return;
    }

    const id = setTimeout(() => onTimeout(), delay);

    return () => clearTimeout(id);
  }, [delay]); // onTimeout is stable
}

export default useTimeout;
