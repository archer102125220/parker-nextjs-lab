import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Hook to detect if a key is pressed
 * @param targetKey - Key or array of keys to listen for
 * @param handler - Optional callback when key is pressed
 * @param options - Event type and target options
 * @returns Boolean indicating if key is currently pressed
 * 
 * @example
 * const isEscapePressed = useKeyPress('Escape');
 * const isEnterPressed = useKeyPress('Enter', () => handleSubmit());
 */
export function useKeyPress(
  targetKey: string | string[],
  handler?: (event: KeyboardEvent) => void,
  options?: {
    event?: 'keydown' | 'keyup';
    target?: Window | Document | HTMLElement;
  }
): boolean {
  const [keyPressed, setKeyPressed] = useState(false);
  const eventType = options?.event || 'keydown';
  const target = options?.target || (typeof window !== 'undefined' ? window : null);

  // Normalize targetKey to array and memoize to avoid re-creating on every render
  const targetKeys = useMemo(
    () => Array.isArray(targetKey) ? targetKey : [targetKey],
    [targetKey]
  );

  const downHandler = useCallback((event: KeyboardEvent) => {
    if (targetKeys.includes(event.key)) {
      setKeyPressed(true);
      handler?.(event);
    }
  }, [targetKeys, handler]);

  const upHandler = useCallback((event: KeyboardEvent) => {
    if (targetKeys.includes(event.key)) {
      setKeyPressed(false);
    }
  }, [targetKeys]);

  useEffect(() => {
    if (!target) return;

    if (eventType === 'keydown') {
      target.addEventListener('keydown', downHandler as EventListener);
      target.addEventListener('keyup', upHandler as EventListener);
    } else {
      target.addEventListener('keyup', downHandler as EventListener);
    }

    return () => {
      if (eventType === 'keydown') {
        target.removeEventListener('keydown', downHandler as EventListener);
        target.removeEventListener('keyup', upHandler as EventListener);
      } else {
        target.removeEventListener('keyup', downHandler as EventListener);
      }
    };
  }, [target, eventType, downHandler, upHandler]);

  return keyPressed;
}

export default useKeyPress;
