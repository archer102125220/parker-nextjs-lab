import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockUnobserve = jest.fn();

let observerCallback: (entries: IntersectionObserverEntry[]) => void;

const mockIntersectionObserver = jest.fn((callback) => {
  observerCallback = callback;
  return {
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: mockUnobserve
  };
});

// Helper to trigger intersection
const triggerIntersection = (isIntersecting: boolean, options: Partial<IntersectionObserverEntry> = {}) => {
  const entry = {
    isIntersecting,
    boundingClientRect: {} as DOMRectReadOnly,
    intersectionRatio: isIntersecting ? 1 : 0,
    intersectionRect: {} as DOMRectReadOnly,
    rootBounds: null,
    target: document.createElement('div'),
    time: Date.now(),
    ...options
  } as IntersectionObserverEntry;

  act(() => {
    observerCallback([entry]);
  });

  return entry;
};

describe('useIntersectionObserver Hook', () => {
  beforeEach(() => {
    window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
    jest.clearAllMocks();
  });

  it('returns undefined initially', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    const { result } = renderHook(() => useIntersectionObserver(ref));

    expect(result.current).toBeUndefined();
  });

  it('observes the element when mounted', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    renderHook(() => useIntersectionObserver(ref));

    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it('returns entry when intersection occurs', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    const { result } = renderHook(() => useIntersectionObserver(ref));

    triggerIntersection(true);

    expect(result.current?.isIntersecting).toBe(true);
  });

  it('updates entry when intersection changes', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    const { result } = renderHook(() => useIntersectionObserver(ref));

    triggerIntersection(true);
    expect(result.current?.isIntersecting).toBe(true);

    triggerIntersection(false);
    expect(result.current?.isIntersecting).toBe(false);
  });

  it('disconnects observer on unmount', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    const { unmount } = renderHook(() => useIntersectionObserver(ref));

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('respects freezeOnceVisible option', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    const { result, rerender } = renderHook(() =>
      useIntersectionObserver(ref, { freezeOnceVisible: true })
    );

    // First trigger - becomes visible
    triggerIntersection(true);
    expect(result.current?.isIntersecting).toBe(true);

    // Rerender with frozen state
    rerender();

    // The entry should remain frozen (isIntersecting = true)
    expect(result.current?.isIntersecting).toBe(true);
  });

  it('uses custom threshold', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    renderHook(() => useIntersectionObserver(ref, { threshold: 0.5 }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    );
  });

  it('uses custom rootMargin', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    renderHook(() => useIntersectionObserver(ref, { rootMargin: '10px' }));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ rootMargin: '10px' })
    );
  });

  it('does not observe when element ref is null', () => {
    const ref = { current: null };

    renderHook(() => useIntersectionObserver(ref));

    expect(mockObserve).not.toHaveBeenCalled();
  });
});
