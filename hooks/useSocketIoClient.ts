import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useEffectEvent
} from 'react';

// Make socket.io-client optional - only import if needed
type Socket = ReturnType<typeof import('socket.io-client').io>;

/**
 * 訊息類型定義（與 Native WebSocket 相同）
 */
export interface SocketIOMessage {
  type: 'broadcast' | 'room' | 'private';
  event?: string;
  room?: string;
  data?: unknown;
  [key: string]: unknown;
}

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

/**
 * 事件監聽器的基礎類型
 * 支援同步和異步函數
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventListener = (...args: any[]) => void | Promise<void>;

/**
 * 預設的監聽器類型
 */
type DefaultListeners = Record<string, EventListener>;

export interface UseSocketIoClientOptions<
  TListeners extends DefaultListeners = DefaultListeners
> {
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
   * 事件監聯器
   * Key 是事件名稱，Value 是處理函數
   *
   * @example
   * listeners: {
   *   connect: () => console.log('connected'),
   *   message: (data: SocketIOMessage) => console.log(data),
   * }
   */
  listeners?: TListeners;
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
  // 新增的便利方法（與 Native WebSocket 相同）
  /** 廣播給所有連線（使用 message 事件） */
  broadcast: (event: string, data: unknown) => void;
  /** 發送給特定房間（使用 message 事件） */
  sendToRoom: (room: string, event: string, data: unknown) => void;
  /** 發送私人訊息（使用 message 事件） */
  sendPrivate: (event: string, data: unknown) => void;
  /** 加入房間 */
  joinRoom: (room: string) => void;
  /** 離開房間 */
  leaveRoom: (room: string) => void;
}

/**
 * Hook to manage Socket.IO client connection
 * Note: Requires socket.io-client to be installed: npm install socket.io-client
 *
 * @param config - Socket.IO configuration with generic listener types
 * @returns Socket getter and connection utilities
 *
 * @example
 * // 使用新的 type/event 設計
 * const { isConnected, broadcast, joinRoom, sendToRoom } = useSocketIoClient({
 *   channel: '/socket.io',
 *   autoConnect: true,
 *   listeners: {
 *     message: (msg: SocketIOMessage) => {
 *       if (msg.event === 'chat:message') {
 *         console.log('聊天:', msg.data);
 *       }
 *     }
 *   }
 * });
 *
 * // 廣播
 * broadcast('chat:message', { text: 'Hello!' });
 * // 房間訊息
 * joinRoom('game-room');
 * sendToRoom('game-room', 'game:move', { x: 10 });
 */
export function useSocketIoClient<
  TListeners extends DefaultListeners = DefaultListeners
>(config: UseSocketIoClientOptions<TListeners> = {}): UseSocketIoClientReturn {
  const {
    channel = '/',
    options = {},
    autoConnect = true,
    listeners = {} as TListeners
  } = config;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Connection trigger state
  const [shouldConnect, setShouldConnect] = useState(autoConnect);
  const [connectCount, setConnectCount] = useState(0);

  const listenersRef = useRef(listeners);
  // Keep listeners ref up to date (useLayoutEffect ensures immediate update)
  useLayoutEffect(() => {
    listenersRef.current = listeners;
  }, [listeners]);

  // Use useEffectEvent for stable handlers
  const handleConnect = useEffectEvent(() => {
    console.log('[Socket.IO Client] Connected:', socketRef.current?.id);
    setIsConnected(true);
    setError(null);
    if (typeof listenersRef.current.connect === 'function') {
      listenersRef.current.connect();
    }
  });

  const handleDisconnect = useEffectEvent((e: unknown) => {
    console.log('[Socket.IO Client] Disconnected');
    setIsConnected(false);
    if (typeof listenersRef.current.disconnect === 'function') {
      listenersRef.current.disconnect(e);
    }
  });

  const handleConnectError = useEffectEvent((err: Error) => {
    console.error('[Socket.IO Client] Connection error:', err);
    setError(err);
    setIsConnected(false);
  });

  // Effect to manage connection
  useEffect(() => {
    let socket: Socket | null = null;

    if (!shouldConnect) {
      return;
    }

    const init = async () => {
      try {
        const { io } = await import('socket.io-client');

        const domain = getSocketIODomain();
        const basePath = getSocketIOBasePath();
        const namespace = channel;
        const socketUrl = domain + namespace;

        console.log(
          '[Socket.IO Client] Connecting to:',
          socketUrl,
          'with path:',
          basePath
        );

        socket = io(socketUrl, {
          path: basePath, // 伺服器端的 Socket.IO 路徑
          autoConnect: false,
          transports: ['websocket'],
          ...options
        });

        socket.on('connect', () => handleConnect());
        socket.on('disconnect', (e: unknown) => handleDisconnect(e));
        socket.on('connect_error', (e: Error) => handleConnectError(e));

        // Dynamic listeners using ref
        Object.keys(listenersRef.current).forEach((eventName) => {
          if (!['connect', 'disconnect'].includes(eventName)) {
            if (socket !== null) {
              socket.on(eventName, (...args: unknown[]) => {
                const handler = listenersRef.current[eventName];
                if (handler) {
                  handler(...args);
                }
              });
            } else {
              console.error(
                '[Socket.IO Client] Socket is not initialized, cannot add listener for:',
                eventName
              );
            }
          }
        });

        // Manager errors
        socket.io.on('error', (err: Error) => {
          console.error('[Socket.IO Client] Manager error:', err);
        });
        socket.io.on('reconnect_error', (err: Error) => {
          console.error('[Socket.IO Client] Reconnect error:', err);
        });

        socketRef.current = socket;
        socket.connect();
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    // Defer initialization
    const timeoutId = setTimeout(() => {
      init();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
      }
      socketRef.current = null;
      setIsConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, shouldConnect, connectCount]); // options mutable

  // Provide a getter function instead of direct ref access
  const getSocket = useCallback(() => socketRef.current, []);

  const connect = useCallback(() => {
    setShouldConnect(true);
    setConnectCount((c) => c + 1);
  }, []);

  const disconnect = useCallback(() => {
    setShouldConnect(false);
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

  // === 新增的便利方法（與 Native WebSocket 相同設計） ===

  // 廣播給所有連線
  const broadcast = useCallback(
    (event: string, data: unknown) => {
      const message: SocketIOMessage = { type: 'broadcast', event, data };
      emit('message', message);
    },
    [emit]
  );

  // 發送給特定房間
  const sendToRoom = useCallback(
    (room: string, event: string, data: unknown) => {
      const message: SocketIOMessage = { type: 'room', room, event, data };
      emit('message', message);
    },
    [emit]
  );

  // 發送私人訊息
  const sendPrivate = useCallback(
    (event: string, data: unknown) => {
      const message: SocketIOMessage = { type: 'private', event, data };
      emit('message', message);
    },
    [emit]
  );

  // 加入房間
  const joinRoom = useCallback(
    (room: string) => {
      const message: SocketIOMessage = {
        type: 'private',
        event: 'joinRoom',
        room
      };
      emit('message', message);
    },
    [emit]
  );

  // 離開房間
  const leaveRoom = useCallback(
    (room: string) => {
      const message: SocketIOMessage = {
        type: 'private',
        event: 'leaveRoom',
        room
      };
      emit('message', message);
    },
    [emit]
  );

  return {
    getSocket,
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
    broadcast,
    sendToRoom,
    sendPrivate,
    joinRoom,
    leaveRoom
  };
}

export default useSocketIoClient;
