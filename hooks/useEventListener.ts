import { useEffect, useEffectEvent } from 'react';

/**
 * Hook to add event listener to window or element
 * @param eventName - Name of the event to listen for
 * @param handler - Event handler function
 * @param element - Element to attach listener to (defaults to window)
 * @param options - Event listener options
 * 
 * @example
 * useEventListener('scroll', handleScroll);
 * useEventListener('click', handleClick, buttonRef);
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window | Document | HTMLElement | null,
  options?: AddEventListenerOptions
): void {
  // Use useEffectEvent for stable handler
  const stableHandler = useEffectEvent((event: Event) => {
    handler(event as WindowEventMap[K]);
  });

  useEffect(() => {
    // Define the listening target
    const targetElement = element ?? window;
    
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Create event listener that calls stable handler
    const eventListener = (event: Event) => {
      stableHandler(event);
    };

    targetElement.addEventListener(eventName, eventListener, options);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]); // stableHandler is stable
}

export default useEventListener;
