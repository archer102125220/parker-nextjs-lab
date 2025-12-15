import { useEffect, useRef, useState, useCallback } from 'react';

// Make socket.io-client optional - only import if needed
type Socket = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface UseSocketIoClientOptions {
  url: string;
  options?: Record<string, unknown>;
  autoConnect?: boolean;
}

export interface UseSocketIoClientReturn {
  getSocket: () => Socket | null;
  isConnected: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, ...args: unknown[]) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler?: (...args: unknown[]) => void) => void;
}

/**
 * Hook to manage Socket.IO client connection
 * Note: Requires socket.io-client to be installed: npm install socket.io-client
 * 
 * @param config - Socket.IO configuration
 * @returns Socket getter and connection utilities
 * 
 * @example
 * const { getSocket, isConnected, emit, on } = useSocketIoClient({
 *   url: 'http://localhost:3001',
 *   autoConnect: true
 * });
 * 
 * useEffect(() => {
 *   on('message', (data) => console.log(data));
 * }, [on]);
 * 
 * // Get socket instance when needed
 * const socket = getSocket();
 */
export function useSocketIoClient(
  config: UseSocketIoClientOptions
): UseSocketIoClientReturn {
  const { url, options = {}, autoConnect = true } = config;
  
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Provide a getter function instead of direct ref access
  const getSocket = useCallback(() => socketRef.current, []);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    try {
      // Dynamic import of socket.io-client
      import('socket.io-client').then(({ io }) => {
        const newSocket = io(url, {
          ...options,
          autoConnect: false
        });

        newSocket.on('connect', () => {
          setIsConnected(true);
          setError(null);
        });

        newSocket.on('disconnect', () => {
          setIsConnected(false);
        });

        newSocket.on('connect_error', (err: Error) => {
          setError(err);
          setIsConnected(false);
        });

        socketRef.current = newSocket;
        newSocket.connect();
      }).catch((err) => {
        setError(new Error('socket.io-client not installed. Run: npm install socket.io-client'));
        console.error('Failed to load socket.io-client:', err);
      });
    } catch (err) {
      setError(err as Error);
    }
  }, [url, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event: string, ...args: unknown[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, ...args);
    }
  }, []);

  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  }, []);

  const off = useCallback((event: string, handler?: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      if (handler) {
        socketRef.current.off(event, handler);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    getSocket,
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off
  };
}

export default useSocketIoClient;

