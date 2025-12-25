import { renderHook, act } from '@testing-library/react';
import useMediaQuery from '@/hooks/useMediaQuery';

describe('useMediaQuery Hook', () => {
  const createMatchMediaMock = (matches: boolean) => {
    const listeners: Array<(e: MediaQueryListEvent) => void> = [];

    return {
      matches,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
        listeners.push(callback);
      }),
      removeEventListener: jest.fn((event: string, callback: (e: MediaQueryListEvent) => void) => {
        const index = listeners.indexOf(callback);
        if (index !== -1) listeners.splice(index, 1);
      }),
      dispatchEvent: jest.fn(),
      // Helper to trigger change
      triggerChange: (newMatches: boolean) => {
        listeners.forEach((listener) => {
          listener({ matches: newMatches } as MediaQueryListEvent);
        });
      }
    };
  };

  it('returns true when media query matches', () => {
    const mockMatchMedia = createMatchMediaMock(true);
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(true);
  });

  it('returns false when media query does not match', () => {
    const mockMatchMedia = createMatchMediaMock(false);
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('updates when media query changes', () => {
    const mockMatchMedia = createMatchMediaMock(false);
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      mockMatchMedia.triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes event listener on unmount', () => {
    const mockMatchMedia = createMatchMediaMock(true);
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    unmount();

    expect(mockMatchMedia.removeEventListener).toHaveBeenCalled();
  });

  it('creates new listener when query changes', () => {
    const mockMatchMedia = createMatchMediaMock(true);
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    const { rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 768px)' } }
    );

    rerender({ query: '(min-width: 1024px)' });

    // Should have called matchMedia twice (once for each query)
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('handles common media queries', () => {
    const testQueries = [
      '(max-width: 768px)',
      '(min-width: 769px) and (max-width: 1024px)',
      '(prefers-color-scheme: dark)',
      '(prefers-reduced-motion: reduce)'
    ];

    testQueries.forEach((query) => {
      const mockMatchMedia = createMatchMediaMock(true);
      window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

      const { result } = renderHook(() => useMediaQuery(query));

      expect(result.current).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith(query);
    });
  });
});
