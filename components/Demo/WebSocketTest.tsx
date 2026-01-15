'use client';

import { useState, useMemo, type ReactNode } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Alert,
  Chip,
  Divider,
  Stack,
  ButtonGroup
} from '@mui/material';
import {
  useWebSocket,
  type WebSocketMessage
} from '@/hooks/useWebSocket';
import styles from '@/app/[locale]/socket-test/websocket/page.module.scss';

export default function WebSocketTest(): ReactNode {
  const [messageList, setMessageList] = useState<WebSocketMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomName, setRoomName] = useState('test-room');
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  // Determine WebSocket URL
  const wsUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const { protocol, hostname } = window.location;
    const isDev = process.env.NODE_ENV === 'development';
    const port = isDev
      ? process.env.NEXT_PUBLIC_WEBSOCKET_PORT || '3003'
      : '';
    const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';

    if (isDev) {
      return `${wsProtocol}//${hostname}:${port}`;
    }
    return `${wsProtocol}//${window.location.host}/api/websocket`;
  }, []);

  const {
    isConnected,
    broadcast,
    sendToRoom,
    sendPrivate,
    joinRoom,
    leaveRoom,
    reconnect,
    close
  } = useWebSocket({
    url: wsUrl,
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    alwaysTriggerOnMessage: false,
    listeners: {
      // 系統事件
      joinedRoom: (msg) => {
        console.log('已加入房間:', msg.room);
        setCurrentRoom(msg.room as string);
        setMessageList((prev) => [
          ...prev,
          { ...msg, _system: true } as WebSocketMessage
        ]);
      },
      leftRoom: (msg) => {
        console.log('已離開房間:', msg.room);
        setCurrentRoom(null);
        setMessageList((prev) => [
          ...prev,
          { ...msg, _system: true } as WebSocketMessage
        ]);
      },
      error: (msg) => {
        console.error('錯誤:', msg.data);
        setMessageList((prev) => [
          ...prev,
          { ...msg, _system: true } as WebSocketMessage
        ]);
      },
      // 自訂事件
      'chat:message': (msg) => {
        console.log('聊天訊息:', msg);
        setMessageList((prev) => [...prev, msg]);
      },
      'room:message': (msg) => {
        console.log('房間訊息:', msg);
        setMessageList((prev) => [...prev, msg]);
      },
      echo: (msg) => {
        console.log('Echo:', msg);
        setMessageList((prev) => [...prev, msg]);
      }
    },
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => {
      console.log('WebSocket disconnected');
      setCurrentRoom(null);
    },
    onError: (event) => console.error('WebSocket error:', event),
    onMessage: (event) => {
      // 只在沒有匹配的 listener 時觸發（因為 alwaysTriggerOnMessage=false）
      console.log('未匹配的訊息:', event.data);
      try {
        const data = JSON.parse(event.data);
        setMessageList((prev) => [...prev, data]);
      } catch {
        setMessageList((prev) => [
          ...prev,
          { type: 'private', data: event.data } as unknown as WebSocketMessage
        ]);
      }
    }
  });

  // 發送廣播
  const handleBroadcast = () => {
    if (!inputMessage.trim()) return;
    broadcast('chat:message', {
      text: inputMessage,
      timestamp: new Date().toISOString()
    });
    setInputMessage('');
  };

  // 發送房間訊息
  const handleRoomMessage = () => {
    if (!inputMessage.trim() || !currentRoom) return;
    sendToRoom(currentRoom, 'room:message', {
      text: inputMessage,
      timestamp: new Date().toISOString()
    });
    setInputMessage('');
  };

  // 發送私人訊息（Echo）
  const handlePrivateMessage = () => {
    if (!inputMessage.trim()) return;
    sendPrivate('echo', {
      text: inputMessage,
      timestamp: new Date().toISOString()
    });
    setInputMessage('');
  };

  // 加入房間
  const handleJoinRoom = () => {
    if (!roomName.trim()) return;
    joinRoom(roomName);
  };

  // 離開房間
  const handleLeaveRoom = () => {
    if (!currentRoom) return;
    leaveRoom(currentRoom);
  };

  // 清除訊息
  const handleClearMessages = () => {
    setMessageList([]);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        原生 WebSocket 測試
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        支援廣播、房間推送、私人訊息。使用 <code>type</code> 定義傳送類型，
        <code>event</code> 定義事件名稱。
      </Alert>

      {/* 連線狀態 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={isConnected ? '已連線' : '未連線'}
            color={isConnected ? 'success' : 'error'}
          />
          {currentRoom && (
            <Chip
              label={`房間: ${currentRoom}`}
              color="primary"
              variant="outlined"
            />
          )}
          <Button
            variant="contained"
            onClick={() => (isConnected ? close() : reconnect())}
          >
            {isConnected ? '斷線' : '連線'}
          </Button>
        </Stack>
      </Paper>

      {/* 房間管理 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          房間管理
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            size="small"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="房間名稱"
            disabled={!isConnected}
            sx={{ width: 200 }}
          />
          <Button
            variant="outlined"
            onClick={handleJoinRoom}
            disabled={!isConnected || !roomName.trim() || !!currentRoom}
          >
            加入房間
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleLeaveRoom}
            disabled={!isConnected || !currentRoom}
          >
            離開房間
          </Button>
        </Stack>
      </Paper>

      {/* 發送訊息 */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          發送訊息
        </Typography>
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="輸入訊息..."
            disabled={!isConnected}
          />
          <ButtonGroup variant="contained" disabled={!isConnected}>
            <Button
              onClick={handleBroadcast}
              disabled={!inputMessage.trim()}
              color="primary"
            >
              廣播 (所有人)
            </Button>
            <Button
              onClick={handleRoomMessage}
              disabled={!inputMessage.trim() || !currentRoom}
              color="secondary"
            >
              房間訊息
            </Button>
            <Button
              onClick={handlePrivateMessage}
              disabled={!inputMessage.trim()}
              color="info"
            >
              私人 (Echo)
            </Button>
          </ButtonGroup>
        </Stack>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* 接收訊息 */}
      <Paper sx={{ p: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle2">
            接收到的訊息 ({messageList.length})
          </Typography>
          <Button size="small" onClick={handleClearMessages}>
            清除
          </Button>
        </Stack>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {messageList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              尚無訊息
            </Typography>
          ) : (
            messageList.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  p: 1,
                  bgcolor: msg._system ? 'info.50' : 'grey.100',
                  borderRadius: 1,
                  borderLeft: msg._system
                    ? '3px solid'
                    : msg.type === 'broadcast'
                      ? '3px solid'
                      : msg.type === 'room'
                        ? '3px solid'
                        : 'none',
                  borderLeftColor: msg._system
                    ? 'info.main'
                    : msg.type === 'broadcast'
                      ? 'primary.main'
                      : msg.type === 'room'
                        ? 'secondary.main'
                        : undefined
                }}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                  <Chip
                    label={msg.type}
                    size="small"
                    color={
                      msg.type === 'broadcast'
                        ? 'primary'
                        : msg.type === 'room'
                          ? 'secondary'
                          : 'default'
                    }
                  />
                  {msg.event && (
                    <Chip
                      label={msg.event}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {msg.room && (
                    <Chip
                      label={`房間: ${msg.room}`}
                      size="small"
                      variant="outlined"
                      color="info"
                    />
                  )}
                </Stack>
                <pre className={styles['websocket_page-message_list_content']}>
                  {JSON.stringify(msg.data ?? msg, null, 2)}
                </pre>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </>
  );
}
