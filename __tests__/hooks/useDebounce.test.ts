import { renderHook, act } from '@testing-library/react';
import useDebounce from '@/hooks/useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial-value', 500));

    // The hook returns the initial value as stored state
    expect(result.current).toBe('initial-value');
  });

  it('updates the debounced value after the delay', () => {
    let value = 'initial';

    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: value, delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update to new value
    value = 'updated';
    rerender({ val: value, delay: 500 });

    // Value should still be the old one before timer fires
    expect(result.current).toBe('initial');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now it should be updated
    expect(result.current).toBe('updated');
  });

  it('resets the timer when value changes before delay completes', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: 'first', delay: 500 } }
    );

    // First update
    rerender({ val: 'second', delay: 500 });

    // Advance time partially
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Value should still be initial
    expect(result.current).toBe('first');

    // Second update before delay completes
    rerender({ val: 'third', delay: 500 });

    // Advance partial time again
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should still be initial because timer reset
    expect(result.current).toBe('first');

    // Complete the remaining delay
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Now should be 'third'
    expect(result.current).toBe('third');
  });

  it('uses default delay of 0 when not provided', () => {
    const { result } = renderHook(() => useDebounce('test'));

    // With 0 delay, should update on next tick
    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(result.current).toBe('test');
  });

  it('cleans up timeout on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('test', 500));

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });

  it('handles delay changes correctly', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, delay),
      { initialProps: { val: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value and change delay
    rerender({ val: 'updated', delay: 1000 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Shouldn't update yet because new delay is 1000ms
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now should be updated
    expect(result.current).toBe('updated');
  });
});
