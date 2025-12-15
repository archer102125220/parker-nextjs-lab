import { useState, useEffect, useCallback, RefObject } from 'react';

export interface SwipeDirection {
  direction: 'up' | 'down' | 'left' | 'right' | null;
  distance: number;
  velocity: number;
}

export interface UseSwipeOptions {
  threshold?: number; // Minimum distance to trigger swipe (px)
  velocityThreshold?: number; // Minimum velocity to trigger swipe (px/ms)
  preventDefaultTouchmoveEvent?: boolean;
}

/**
 * Hook to detect and classify swipe direction
 * @param ref - Ref to the element to detect swipes on
 * @param options - Swipe detection options
 * @returns Swipe direction, distance, and velocity
 * 
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const swipe = useClassifySwipeDirection(ref, { threshold: 50 });
 * if (swipe.direction === 'left') handleSwipeLeft();
 */
export function useClassifySwipeDirection(
  ref: RefObject<HTMLElement>,
  options: UseSwipeOptions = {}
): SwipeDirection {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    preventDefaultTouchmoveEvent = false
  } = options;

  const [swipe, setSwipe] = useState<SwipeDirection>({
    direction: null,
    distance: 0,
    velocity: 0
  });

  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
  }, [preventDefaultTouchmoveEvent]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    let direction: 'up' | 'down' | 'left' | 'right' | null = null;

    // Check if swipe meets threshold requirements
    if (distance >= threshold && velocity >= velocityThreshold) {
      // Determine primary direction
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }
    }

    setSwipe({ direction, distance, velocity });
    setTouchStart(null);

    // Reset direction after a short delay
    setTimeout(() => {
      setSwipe({ direction: null, distance: 0, velocity: 0 });
    }, 100);
  }, [touchStart, threshold, velocityThreshold]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [ref, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return swipe;
}

export default useClassifySwipeDirection;
