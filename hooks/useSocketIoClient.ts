import { useEffect, useState, useCallback } from 'react';

// Make socket.io-client optional - only import if needed
type Socket = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface UseSocketIoClientOptions {
  url: string;
  options?: Record<string, unknown>;
  autoConnect?: boolean;
}

export interface UseSocketIoClientReturn {
  socket: Socket | null;
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
 * @returns Socket instance and connection utilities
 * 
 * @example
 * const { socket, isConnected, emit, on } = useSocketIoClient({
 *   url: 'http://localhost:3001',
 *   autoConnect: true
 * });
 * 
 * useEffect(() => {
 *   on('message', (data) => console.log(data));
 * }, [on]);
 */
export function useSocketIoClient(
  config: UseSocketIoClientOptions
): UseSocketIoClientReturn {
  const { url, options = {}, autoConnect = true } = config;
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(() => {
    if (socket?.connected) return;

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

        setSocket(newSocket);
        newSocket.connect();
      }).catch((err) => {
        setError(new Error('socket.io-client not installed. Run: npm install socket.io-client'));
        console.error('Failed to load socket.io-client:', err);
      });
    } catch (err) {
      setError(err as Error);
    }
  }, [url, options, socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const emit = useCallback((event: string, ...args: unknown[]) => {
    if (socket?.connected) {
      socket.emit(event, ...args);
    }
  }, [socket]);

  const on = useCallback((event: string, handler: (...args: unknown[]) => void) => {
    if (socket) {
      socket.on(event, handler);
    }
  }, [socket]);

  const off = useCallback((event: string, handler?: (...args: unknown[]) => void) => {
    if (socket) {
      if (handler) {
        socket.off(event, handler);
      } else {
        socket.off(event);
      }
    }
  }, [socket]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket,
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

