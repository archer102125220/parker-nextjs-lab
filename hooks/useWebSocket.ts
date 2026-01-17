'use client';

import {
  useRef,
  useEffect,
  useLayoutEffect,
  useEffectEvent,
  useState,
  useCallback
} from 'react';

/**
 * 傳送類型
 * - broadcast: 廣播給所有連線
 * - room: 推送給特定房間
 * - private: 私人訊息（預設，只回傳給發送者）
 */
export type WebSocketMessageType = 'broadcast' | 'room' | 'private';

/**
 * 訊息格式定義
 */
export interface WebSocketMessage {
  /** 傳送類型 */
  type: WebSocketMessageType;
  /** 事件名稱（用於觸發對應的 listener） */
  event?: string;
  /** 房間名稱（type 為 'room' 時必填） */
  room?: string;
  /** 訊息資料 */
  data?: unknown;
  [key: string]: unknown;
}

/**
 * 事件監聯器類型
 * Key: event 欄位的值
 * Value: 處理函式
 */
export type WebSocketEventListeners = {
  [eventName: string]: (message: WebSocketMessage) => void;
};

export interface UseWebSocketOptions {
  /** WebSocket URL */
  url: string;
  /** Protocols to use */
  protocols?: string | string[];
  /** Callback when connection opens */
  onOpen?: (event: Event) => void;
  /** Callback when message received (raw) */
  onMessage?: (event: MessageEvent) => void;
  /** Callback when connection closes */
  onClose?: (event: CloseEvent) => void;
  /** Callback when error occurs */
  onError?: (event: Event) => void;
  /** Auto reconnect on close */
  autoReconnect?: boolean;
  /** Reconnect interval in ms */
  reconnectInterval?: number;
  /** Maximum reconnect attempts */
  maxReconnectAttempts?: number;
  /**
   * 是否總是觸發 onMessage
   * - true: 無論是否有匹配的 listener，都會觸發 onMessage
   * - false: 如果有匹配的 listener，不觸發 onMessage（預設）
   */
  alwaysTriggerOnMessage?: boolean;
  /**
   * 事件監聽器
   * 根據訊息的 event 欄位觸發對應的 handler
   * @example
   * listeners: {
   *   'chat:message': (msg) => console.log('聊天訊息:', msg),
   *   'user:joined': (msg) => console.log('用戶加入:', msg),
   * }
   */
  listeners?: WebSocketEventListeners;
}

export interface UseWebSocketReturn {
  /** Get the WebSocket instance */
  getSocket: () => WebSocket | null;
  /** Connection ready state */
  readyState: number;
  /** Whether connected */
  isConnected: boolean;
  /** Send raw message */
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  /** Send private message (只回傳給發送者) */
  sendPrivate: (event: string, data: unknown) => void;
  /** Broadcast to all connected clients (廣播給所有人) */
  broadcast: (event: string, data: unknown) => void;
  /** Send to specific room (發送給特定房間) */
  sendToRoom: (room: string, event: string, data: unknown) => void;
  /** Join a room */
  joinRoom: (room: string) => void;
  /** Leave a room */
  leaveRoom: (room: string) => void;
  /** Close the connection */
  close: (code?: number, reason?: string) => void;
  /** Reconnect manually */
  reconnect: () => void;
}

/**
 * useWebSocket - A React hook for WebSocket connections
 *
 * 訊息格式：
 * {
 *   type: 'broadcast' | 'room' | 'private',  // 傳送類型
 *   event: 'eventName',                       // 事件名稱（用於 listener 路由）
 *   room?: 'roomName',                        // 房間名稱（type 為 'room' 時）
 *   data: any                                 // 訊息資料
 * }
 */
export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    protocols,
    onOpen,
    onMessage,
    onClose,
    onError,
    autoReconnect = false,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    alwaysTriggerOnMessage = false,
    listeners = {}
  } = options;

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const listenersRef = useRef(listeners);

  const [readyState, setReadyState] = useState<number>(3); // WebSocket.CLOSED = 3
  const [isConnected, setIsConnected] = useState(false);
  const [connectCount, setConnectCount] = useState(0);

  // Keep listeners ref up to date (useLayoutEffect ensures immediate update)
  useLayoutEffect(() => {
    listenersRef.current = listeners;
  }, [listeners]);

  // Use useEffectEvent for stable handlers
  const handleOpen = useEffectEvent((event: Event) => {
    setReadyState(WebSocket.OPEN);
    setIsConnected(true);
    reconnectAttemptsRef.current = 0;
    onOpen?.(event);
  });

  const handleMessage = useEffectEvent((event: MessageEvent) => {
    let listenerTriggered = false;

    // 嘗試解析 JSON 並根據 event 欄位觸發對應的 listener
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const eventName = message.event;

      if (eventName && typeof listenersRef.current[eventName] === 'function') {
        listenersRef.current[eventName](message);
        listenerTriggered = true;
      }
    } catch {
      // 非 JSON 訊息
    }

    // 根據 alwaysTriggerOnMessage 決定是否觸發 onMessage
    if (alwaysTriggerOnMessage || !listenerTriggered) {
      onMessage?.(event);
    }
  });

  const handleError = useEffectEvent((event: Event) => {
    onError?.(event);
  });

  const handleClose = useEffectEvent((event: CloseEvent) => {
    setReadyState(WebSocket.CLOSED);
    setIsConnected(false);
    onClose?.(event);

    // Auto reconnect logic
    if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current++;
        setConnectCount((c) => c + 1);
      }, reconnectInterval);
    }
  });

  // Connect effect
  useEffect(() => {
    // Skip if autoConnect is false and we haven't manually triggered yet
    if (!autoReconnect && connectCount === 0) {
      return;
    }

    let socket: WebSocket | null = null;

    const connect = () => {
      if (typeof window === 'undefined') return;
      try {
        // Close existing connection if any
        if (socketRef.current) {
          socketRef.current.close();
        }

        socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

        socket.onopen = (event) => handleOpen(event);
        socket.onmessage = (event) => handleMessage(event);
        socket.onerror = (event) => handleError(event);
        socket.onclose = (event) => handleClose(event);

        socketRef.current = socket;
        setReadyState(socket.readyState);
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };

    // Defer connection to avoid set-state-in-effect
    const timeoutId = setTimeout(() => {
      connect();
    }, 0);

    return () => {
      clearTimeout(timeoutId);

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [url, protocols, connectCount, autoReconnect]);

  const getSocket = useCallback(() => socketRef.current, []);

  const send = useCallback(
    (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(data);
      } else {
        console.warn('WebSocket is not connected');
      }
    },
    []
  );

  // 發送私人訊息（只回傳給發送者）
  const sendPrivate = useCallback(
    (event: string, data: unknown) => {
      const message: WebSocketMessage = { type: 'private', event, data };
      send(JSON.stringify(message));
    },
    [send]
  );

  // 廣播給所有連線
  const broadcast = useCallback(
    (event: string, data: unknown) => {
      const message: WebSocketMessage = { type: 'broadcast', event, data };
      send(JSON.stringify(message));
    },
    [send]
  );

  // 發送給特定房間
  const sendToRoom = useCallback(
    (room: string, event: string, data: unknown) => {
      const message: WebSocketMessage = { type: 'room', room, event, data };
      send(JSON.stringify(message));
    },
    [send]
  );

  // 加入房間
  const joinRoom = useCallback(
    (room: string) => {
      const message: WebSocketMessage = { type: 'private', event: 'joinRoom', room };
      send(JSON.stringify(message));
    },
    [send]
  );

  // 離開房間
  const leaveRoom = useCallback(
    (room: string) => {
      const message: WebSocketMessage = { type: 'private', event: 'leaveRoom', room };
      send(JSON.stringify(message));
    },
    [send]
  );

  const close = useCallback(
    (code?: number, reason?: string) => {
      // Cancel any pending reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent auto-reconnect

      if (socketRef.current) {
        socketRef.current.close(code, reason);
        socketRef.current = null;
      }
    },
    [maxReconnectAttempts]
  );

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setConnectCount((c) => c + 1);
  }, []);

  return {
    getSocket,
    readyState,
    isConnected,
    send,
    sendPrivate,
    broadcast,
    sendToRoom,
    joinRoom,
    leaveRoom,
    close,
    reconnect
  };
}

export default useWebSocket;
