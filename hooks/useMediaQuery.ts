import { useState, useEffect } from 'react';

/**
 * useMediaQuery Hook
 * 
 * 監聽 media query 變化,用於響應式設計
 * 
 * @param query - Media query 字串
 * @returns boolean - 是否匹配該 media query
 * 
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * 
 * return (
 *   <div>
 *     {isMobile && <MobileView />}
 *     {isTablet && <TabletView />}
 *     {!isMobile && !isTablet && <DesktopView />}
 *   </div>
 * );
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Update state if the media query matches
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mediaQuery.matches);

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
