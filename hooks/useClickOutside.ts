import { useRef, useEffect, RefObject } from 'react';

/**
 * Hook to detect clicks outside of an element
 * @param handler - Function to call when click outside is detected
 * @returns Ref to attach to the element
 * 
 * @example
 * const ref = useClickOutside(() => setIsOpen(false));
 * return <div ref={ref}>Content</div>;
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: (event: MouseEvent | TouchEvent) => void
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      
      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}

export default useClickOutside;
