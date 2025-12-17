import { useEffect, useRef, useState, useCallback } from 'react';

// Make socket.io-client optional - only import if needed
type Socket = ReturnType<typeof import('socket.io-client').io>;

// 環境變數設定
const getSocketIODomain = (): string => {
  // 開發環境使用獨立的 Socket.IO 伺服器埠
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.NEXT_PUBLIC_SOCKET_IO_PORT || '3002';
    if (typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:${port}`;
    }
    return `http://localhost:${port}`;
  }

  // 生產環境使用環境變數或當前 origin
  return (
    process.env.NEXT_PUBLIC_SOCKET_IO_DOMAIN ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  );
};

const getSocketIOBasePath = (): string => {
  return process.env.NEXT_PUBLIC_SOCKET_IO_BASE_PATH || '/socket.io';
};

export interface UseSocketIoClientOptions {
  /**
   * Socket.IO 命名空間頻道
   * @default '/'
   * @example '/socket.io', '/socket.io/room', '/socket.io/web-rtc'
   */
  channel?: string;
  /**
   * 是否將 channel 作為 path 的一部分
   * @default true
   */
  channelAsPath?: boolean;
  /**
   * 額外的 Socket.IO 選項
   */
  options?: Record<string, unknown>;
  /**
   * 是否自動連線
   * @default true
   */
  autoConnect?: boolean;
  /**
   * 事件監聽器
   */
  listeners?: Record<string, (...args: unknown[]) => void>;
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
 *   channel: '/socket.io',
 *   autoConnect: true,
 *   listeners: {
 *     message: (data) => console.log(data)
 *   }
 * });
 *
 * // Get socket instance when needed
 * const socket = getSocket();
 */
export function useSocketIoClient(
  config: UseSocketIoClientOptions = {}
): UseSocketIoClientReturn {
  const {
    channel = '/',
    options = {},
    autoConnect = true,
    listeners = {}
  } = config;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 使用 useRef 來存儲 config，避免依賴變更導致無限重連
  const configRef = useRef({ channel, options, listeners });
  const initializedRef = useRef(false);

  // 更新 configRef（不觸發重新渲染）
  configRef.current = { channel, options, listeners };

  // Provide a getter function instead of direct ref access
  const getSocket = useCallback(() => socketRef.current, []);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (socketRef.current?.connected) return;
    if (initializedRef.current) return; // 防止重複初始化

    initializedRef.current = true;

    try {
      // Dynamic import of socket.io-client
      import('socket.io-client')
        .then(({ io }) => {
          const domain = getSocketIODomain();
          const basePath = getSocketIOBasePath();
          const {
            channel: currentChannel,
            options: currentOptions,
            listeners: currentListeners
          } = configRef.current;

          // Socket.IO 的 path 是伺服器端路徑（固定為 /socket.io）
          // namespace 是命名空間（如 /、/socket.io、/socket.io/room）
          // 連線 URL = domain + namespace
          const namespace = currentChannel;
          const socketUrl = domain + namespace;

          console.log(
            '[Socket.IO Client] Connecting to:',
            socketUrl,
            'with path:',
            basePath
          );

          const newSocket = io(socketUrl, {
            path: basePath, // 伺服器端的 Socket.IO 路徑
            autoConnect: false,
            transports: ['websocket'],
            ...currentOptions
          });

          newSocket.on('connect', () => {
            console.log('[Socket.IO Client] Connected:', newSocket.id);
            setIsConnected(true);
            setError(null);

            // 觸發自定義 connect listener
            if (typeof currentListeners.connect === 'function') {
              currentListeners.connect();
            }
          });

          newSocket.on('disconnect', () => {
            console.log('[Socket.IO Client] Disconnected');
            setIsConnected(false);

            // 觸發自定義 disconnect listener
            if (typeof currentListeners.disconnect === 'function') {
              currentListeners.disconnect();
            }
          });

          newSocket.on('connect_error', (err: Error) => {
            console.error('[Socket.IO Client] Connection error:', err);
            setError(err);
            setIsConnected(false);
          });

          // 註冊其他自定義 listeners
          Object.keys(currentListeners).forEach((eventName) => {
            if (!['connect', 'disconnect'].includes(eventName)) {
              if (typeof currentListeners[eventName] === 'function') {
                newSocket.on(eventName, currentListeners[eventName]);
              }
            }
          });

          // Manager 層級的錯誤處理
          newSocket.io.on('error', (err) => {
            console.error('[Socket.IO Client] Manager error:', err);
          });

          newSocket.io.on('reconnect_error', (err) => {
            console.error('[Socket.IO Client] Reconnect error:', err);
          });

          newSocket.io.on('reconnect_failed', () => {
            console.error('[Socket.IO Client] Reconnect failed');
          });

          socketRef.current = newSocket;
          newSocket.connect();
        })
        .catch((err) => {
          initializedRef.current = false;
          setError(
            new Error(
              'socket.io-client not installed. Run: npm install socket.io-client'
            )
          );
          console.error('Failed to load socket.io-client:', err);
        });
    } catch (err) {
      initializedRef.current = false;
      setError(err as Error);
    }
  }, []); // 移除所有依賴，使用 configRef

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      initializedRef.current = false; // 重置初始化狀態以允許重新連線
    }
  }, []);

  const emit = useCallback((event: string, ...args: unknown[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, ...args);
    }
  }, []);

  const on = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      if (socketRef.current) {
        socketRef.current.on(event, handler);
      }
    },
    []
  );

  const off = useCallback(
    (event: string, handler?: (...args: unknown[]) => void) => {
      if (socketRef.current) {
        if (handler) {
          socketRef.current.off(event, handler);
        } else {
          socketRef.current.off(event);
        }
      }
    },
    []
  );

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
