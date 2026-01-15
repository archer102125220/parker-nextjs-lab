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
  useSocketIoClient,
  type SocketIOMessage
} from '@/hooks/useSocketIoClient';
import styles from '@/app/[locale]/socket-test/socket-io/page.module.scss';

export default function SocketIoTest(): ReactNode {
  const [messageList, setMessageList] = useState<SocketIOMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomName, setRoomName] = useState('test-room');
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  // 處理收到的訊息
  const handleMessage = useMemo(
    () => (msg: SocketIOMessage) => {
      console.log('Received message:', msg);

      // 處理系統事件
      if (msg.event === 'joinedRoom') {
        setCurrentRoom(msg.room as string);
        setMessageList((prev) => [
          ...prev,
          { ...msg, _system: true } as SocketIOMessage
        ]);
        return;
      }

      if (msg.event === 'leftRoom') {
        setCurrentRoom(null);
        setMessageList((prev) => [
          ...prev,
          { ...msg, _system: true } as SocketIOMessage
        ]);
        return;
      }

      if (msg.event === 'error') {
        setMessageList((prev) => [
          ...prev,
          { ...msg, _system: true } as SocketIOMessage
        ]);
        return;
      }

      // 一般訊息
      setMessageList((prev) => [...prev, msg]);
    },
    []
  );

  const {
    isConnected,
    error,
    connect,
    disconnect,
    broadcast,
    sendToRoom,
    sendPrivate,
    joinRoom,
    leaveRoom
  } = useSocketIoClient({
    channel: '/socket.io',
    autoConnect: true,
    listeners: {
      message: handleMessage,
      connect: () => console.log('[SocketIoPage] Connected'),
      disconnect: () => {
        console.log('[SocketIoPage] Disconnected');
        setCurrentRoom(null);
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
        Socket.IO 測試
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        支援廣播、房間推送、私人訊息。使用 <code>type</code> 定義傳送類型，
        <code>event</code> 定義事件名稱。
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          連線錯誤: {error.message}
        </Alert>
      )}

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
            onClick={() => (isConnected ? disconnect() : connect())}
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
        <Box
          className={styles['socket_io_page-message_list']}
          sx={{ maxHeight: 400, overflow: 'auto' }}
        >
          {messageList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              尚無訊息
            </Typography>
          ) : (
            messageList.map((msg, index) => (
              <Box
                key={index}
                className={styles['socket_io_page-message_list_item']}
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
                    <Chip label={msg.event} size="small" variant="outlined" />
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
                <pre className={styles['socket_io_page-message_list_content']}>
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
