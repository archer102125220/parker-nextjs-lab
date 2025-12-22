'use client';

import { useState, useCallback } from 'react';
import {
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  Chip
} from '@mui/material';

import { useSocketIoClient } from '@/hooks/useSocketIoClient';
import styles from './page.module.scss';

export default function SocketIoPage(): React.ReactNode {
  const [messageList, setMessageList] = useState<unknown[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSocketIoTest = useCallback((payload: unknown) => {
    console.log('Received socket.io-test:', payload);
    setMessageList((prev) => [
      ...prev,
      { event: 'socket.io-test', data: payload }
    ]);
  }, []);

  const handleMessage = useCallback((payload: unknown) => {
    console.log('Received message:', payload);
    setMessageList((prev) => [...prev, { event: 'message', data: payload }]);
  }, []);

  const { isConnected, connect, disconnect, emit, error } = useSocketIoClient({
    channel: '/socket.io',
    autoConnect: true,
    listeners: {
      'socket.io-test': handleSocketIoTest,
      message: handleMessage,
      connect: () => console.log('[SocketIoPage] Connected'),
      disconnect: () => console.log('[SocketIoPage] Disconnected')
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const payload = {
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    emit('message', payload);
    setInputMessage('');
  };

  const handleSendTestData = () => {
    emit('socket.io-test', {
      a: 'b',
      c: [],
      testData: 'socket.io test Data'
    });
  };

  return (
    <section className={styles.socket_io_page}>
      <Typography variant="h5" gutterBottom>
        Socket.IO 測試
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        注意：Socket.IO 需要伺服器端支援。在 serverless 環境（如
        Vercel）中可能無法正常運作。
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          連線錯誤: {error.message}
        </Alert>
      )}

      <div className={styles.controls}>
        <Chip
          label={isConnected ? '已連線' : '未連線'}
          color={isConnected ? 'success' : 'error'}
        />
        <Button
          variant="contained"
          onClick={() => (isConnected ? disconnect() : connect())}
        >
          {isConnected ? '斷線' : '連線'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleSendTestData}
          disabled={!isConnected}
        >
          發送測試資料
        </Button>
      </div>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          發送訊息
        </Typography>
        <div className={styles.message_form}>
          <TextField
            fullWidth
            size="small"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="輸入訊息..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!isConnected}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!isConnected || !inputMessage.trim()}
          >
            發送
          </Button>
        </div>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          接收到的訊息：
        </Typography>
        <div className={styles.message_list}>
          {messageList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              尚無訊息
            </Typography>
          ) : (
            messageList.map((msg, index) => (
              <div key={index} className={styles.message_list_item}>
                <pre className={styles.message_list_content}>
                  {JSON.stringify(msg, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </Paper>
    </section>
  );
}
