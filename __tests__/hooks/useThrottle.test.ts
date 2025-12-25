import { renderHook, act } from '@testing-library/react';
import useThrottle from '@/hooks/useThrottle';

describe('useThrottle Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('executes callback immediately on first call (leading edge)', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('throttles subsequent calls within the delay period', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    // Only first call should execute immediately
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('executes trailing call after delay period', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
      result.current(); // This should be the trailing call
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Advance time to trigger trailing call
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('allows new call after delay period passes', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Advance time beyond delay
    act(() => {
      jest.advanceTimersByTime(600);
    });

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('passes arguments to the callback', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current('arg1', 'arg2');
    });

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('respects leading: false option', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottle(callback, 500, { leading: false })
    );

    act(() => {
      result.current();
    });

    // Should not execute immediately
    expect(callback).toHaveBeenCalledTimes(0);

    // Should execute after delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('respects trailing: false option', () => {
    const callback = jest.fn();
    const { result } = renderHook(() =>
      useThrottle(callback, 500, { trailing: false })
    );

    act(() => {
      result.current();
      result.current(); // This trailing call should be ignored
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Advance time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should still be 1 (no trailing call)
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('cleans up timeout on unmount', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current();
      result.current(); // Schedule trailing call
    });

    // Unmount before trailing call executes
    unmount();

    // Advance time - trailing should not execute
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Only the leading call should have executed
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('uses the latest arguments for trailing call', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 500));

    act(() => {
      result.current('first');
      result.current('second');
      result.current('third');
    });

    expect(callback).toHaveBeenNthCalledWith(1, 'first');

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Trailing call should use the latest arguments
    expect(callback).toHaveBeenNthCalledWith(2, 'third');
  });
});
