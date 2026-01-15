'use client';

import { useEffect, useCallback, useEffectEvent } from 'react';

/**
 * useBeforeunload - A React hook for handling the beforeunload event
 *
 * @param handler - Function to call before page unload
 * @param enabled - Whether the handler is enabled (default: true)
 * @returns Function to manually remove the listener
 *
 * @example
 * ```tsx
 * // Basic usage - show confirmation dialog before leaving
 * useBeforeunload((event) => {
 *   event.preventDefault();
 *   return 'Are you sure you want to leave?';
 * });
 *
 * // Conditional usage
 * useBeforeunload(
 *   (event) => {
 *     if (hasUnsavedChanges) {
 *       event.preventDefault();
 *       return 'You have unsaved changes!';
 *     }
 *   },
 *   hasUnsavedChanges
 * );
 * ```
 */
export function useBeforeunload(
  handler: (event: BeforeUnloadEvent) => string | void,
  enabled: boolean = true
): () => void {
  // Use useEffectEvent to get stable handler reference
  const handleBeforeunload = useEffectEvent((event: BeforeUnloadEvent) => {
    const result = handler(event);
    if (result) {
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue = result;
      return result;
    }
  });

  const removeListener = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.onbeforeunload = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      return;
    }

    window.addEventListener('beforeunload', handleBeforeunload);
    window.onbeforeunload = handleBeforeunload;

    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
      window.onbeforeunload = null;
    };
  }, [enabled]);

  return removeListener;
}

export default useBeforeunload;

