import { renderHook, act } from '@testing-library/react';
import useLocalStorage from '@/hooks/useLocalStorage';

describe('useLocalStorage Hook', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      })
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );

    expect(result.current[0]).toBe('defaultValue');
  });

  it('returns stored value from localStorage', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify('storedValue'));

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );

    expect(result.current[0]).toBe('storedValue');
  });

  it('stores value in localStorage when setValue is called', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify('newValue')
    );
  });

  it('supports function updater like useState', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('removes value from localStorage when removeValue is called', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify('storedValue'));

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBe('defaultValue');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
  });

  it('handles complex objects', () => {
    const complexObject = { name: 'John', items: [1, 2, 3] };

    const { result } = renderHook(() =>
      useLocalStorage('user', { name: '', items: [] as number[] })
    );

    act(() => {
      result.current[1](complexObject);
    });

    expect(result.current[0]).toEqual(complexObject);
  });

  it('handles localStorage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('handles storage events from other tabs', () => {
    const { result } = renderHook(() =>
      useLocalStorage('sharedKey', 'initial')
    );

    // Simulate storage event from another tab
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'sharedKey',
        newValue: JSON.stringify('updatedFromOtherTab')
      });
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe('updatedFromOtherTab');
  });

  it('ignores storage events for other keys', () => {
    const { result } = renderHook(() =>
      useLocalStorage('myKey', 'initial')
    );

    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'otherKey',
        newValue: JSON.stringify('otherValue')
      });
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe('initial');
  });
});
