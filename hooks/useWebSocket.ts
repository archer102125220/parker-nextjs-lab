'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

export interface UseWebSocketOptions {
  /** WebSocket URL */
  url: string;
  /** Protocols to use */
  protocols?: string | string[];
  /** Callback when connection opens */
  onOpen?: (event: Event) => void;
  /** Callback when message received */
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
}

export interface UseWebSocketReturn {
  /** The WebSocket instance */
  socket: WebSocket | null;
  /** Connection ready state */
  readyState: number;
  /** Whether connected */
  isConnected: boolean;
  /** Send a message */
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  /** Send JSON data */
  sendJson: (data: unknown) => void;
  /** Close the connection */
  close: (code?: number, reason?: string) => void;
  /** Reconnect manually */
  reconnect: () => void;
}

/**
 * useWebSocket - A React hook for WebSocket connections
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
    maxReconnectAttempts = 5
  } = options;

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Store all dynamic values in refs to avoid stale closures
  const urlRef = useRef(url);
  const protocolsRef = useRef(protocols);
  const autoReconnectRef = useRef(autoReconnect);
  const reconnectIntervalRef = useRef(reconnectInterval);
  const maxReconnectAttemptsRef = useRef(maxReconnectAttempts);
  const onOpenRef = useRef(onOpen);
  const onMessageRef = useRef(onMessage);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  useEffect(() => {
    urlRef.current = url;
    protocolsRef.current = protocols;
    autoReconnectRef.current = autoReconnect;
    reconnectIntervalRef.current = reconnectInterval;
    maxReconnectAttemptsRef.current = maxReconnectAttempts;
    onOpenRef.current = onOpen;
    onMessageRef.current = onMessage;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;
  });

  const [readyState, setReadyState] = useState<number>(3); // WebSocket.CLOSED = 3
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(function doConnect() {
    if (typeof window === 'undefined') return;

    try {
      // Close existing connection
      if (socketRef.current) {
        socketRef.current.close();
      }

      const socket = protocolsRef.current
        ? new WebSocket(urlRef.current, protocolsRef.current)
        : new WebSocket(urlRef.current);

      socket.onopen = (event) => {
        setReadyState(WebSocket.OPEN);
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onOpenRef.current?.(event);
      };

      socket.onmessage = (event) => {
        onMessageRef.current?.(event);
      };

      socket.onclose = (event) => {
        setReadyState(WebSocket.CLOSED);
        setIsConnected(false);
        onCloseRef.current?.(event);

        // Auto reconnect logic
        if (
          autoReconnectRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttemptsRef.current
        ) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            doConnect();
          }, reconnectIntervalRef.current);
        }
      };

      socket.onerror = (event) => {
        onErrorRef.current?.(event);
      };

      socketRef.current = socket;
      setReadyState(socket.readyState);
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

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

  const sendJson = useCallback(
    (data: unknown) => {
      send(JSON.stringify(data));
    },
    [send]
  );

  const close = useCallback((code?: number, reason?: string) => {
    // Cancel any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptsRef.current = maxReconnectAttemptsRef.current; // Prevent auto-reconnect

    if (socketRef.current) {
      socketRef.current.close(code, reason);
      socketRef.current = null;
    }
  }, []);

  const reconnectFn = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  return {
    socket: socketRef.current,
    readyState,
    isConnected,
    send,
    sendJson,
    close,
    reconnect: reconnectFn
  };
}

export default useWebSocket;
