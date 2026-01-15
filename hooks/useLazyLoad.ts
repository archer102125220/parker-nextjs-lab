'use client';

import { useEffect, useState, useEffectEvent, type RefObject } from 'react';

export interface UseLazyLoadOptions {
  /** Fallback image src when loading */
  loading?: string;
  /** Fallback image src when error occurs */
  errorImg?: string;
  /** Intersection Observer options */
  rootMargin?: string;
  threshold?: number | number[];
  /** Callback when error occurs */
  onError?: (event: Event) => void;
  /** Callback when image loads successfully */
  onLoad?: (event: Event) => void;
}

export interface UseLazyLoadReturn {
  /** Whether the image is currently loading */
  isLoading: boolean;
  /** Whether an error occurred */
  hasError: boolean;
  /** Whether the image has loaded successfully */
  isLoaded: boolean;
}

/**
 * useLazyLoad - A React hook for lazy loading images using Intersection Observer
 *
 * @param ref - React ref object attached to the img element
 * @param src - The actual image source to load when visible
 * @param options - Configuration options
 * @returns Object containing loading state, error state, and loaded state
 *
 * @example
 * ```tsx
 * const imgRef = useRef<HTMLImageElement>(null);
 * const { isLoading, hasError, isLoaded } = useLazyLoad(imgRef, '/img/my-image.jpg', {
 *   loading: '/img/placeholder.jpg',
 *   errorImg: '/img/error.jpg',
 *   rootMargin: '100px',
 * });
 *
 * return <img ref={imgRef} alt="Lazy loaded image" />;
 * ```
 */
export function useLazyLoad(
  ref: RefObject<HTMLImageElement | null>,
  src: string,
  options: UseLazyLoadOptions = {}
): UseLazyLoadReturn {
  const {
    loading: loadingSrc,
    errorImg,
    rootMargin = '50px',
    threshold = 0,
    onError,
    onLoad
  } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use useEffectEvent for callbacks to avoid them as dependencies
  const handleLoadCallback = useEffectEvent((event: Event) => {
    onLoad?.(event);
  });

  const handleErrorCallback = useEffectEvent((event: Event) => {
    onError?.(event);
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial loading image or make transparent
    if (loadingSrc) {
      element.src = loadingSrc;
    } else {
      element.style.opacity = '0';
    }

    // Check if IntersectionObserver is available
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback: load immediately
      element.src = src;
      return;
    }

    const handleLoad = (event: Event) => {
      setIsLoading(false);
      setIsLoaded(true);
      setHasError(false);
      handleLoadCallback(event);
    };

    const handleError = (event: Event) => {
      setIsLoading(false);
      setHasError(true);

      // Try to load error image if provided
      if (errorImg && ref.current) {
        ref.current.src = errorImg;
      }

      handleErrorCallback(event);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;

            // Add event listeners
            img.addEventListener('load', handleLoad);
            img.addEventListener('error', handleError);

            // Set the actual source
            img.src = src;

            // Restore opacity if it was hidden
            if (!loadingSrc) {
              img.style.opacity = '1';
              img.style.transition = 'opacity 0.3s ease-in-out';
            }

            // Stop observing
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      element.removeEventListener('load', handleLoad);
      element.removeEventListener('error', handleError);
    };
  }, [src, loadingSrc, errorImg, rootMargin, threshold, ref]);

  return {
    isLoading,
    hasError,
    isLoaded
  };
}

export default useLazyLoad;

