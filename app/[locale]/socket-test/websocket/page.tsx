'use client';

import { useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Alert,
  Chip
} from '@mui/material';

import { useWebSocket } from '@/hooks/useWebSocket';

export default function WebSocketPage(): React.ReactNode {
  const [messageList, setMessageList] = useState<unknown[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const wsUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/websocket`
      : '';

  const handleMessage = useCallback((event: MessageEvent) => {
    console.log('Received:', event.data);
    try {
      const data = JSON.parse(event.data);
      setMessageList((prev) => [...prev, data]);
    } catch {
      setMessageList((prev) => [...prev, event.data]);
    }
  }, []);

  const { isConnected, sendJson, reconnect, close } = useWebSocket({
    url: wsUrl,
    onMessage: handleMessage,
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    onError: (event) => console.error('WebSocket error:', event),
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const payload = {
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    sendJson(payload);
    setInputMessage('');
  };

  const handleSendTestData = () => {
    sendJson({
      type: 'test',
      data: {
        a: 'b',
        c: [],
        testData: 'WebSocket test Data'
      }
    });
  };

  return (
    <section>
      <Typography variant="h5" gutterBottom>
        原生 WebSocket 測試
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        使用原生 WebSocket API。注意：在 serverless 環境中 WebSocket
        支援可能受限。
      </Alert>

      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Chip
          label={isConnected ? '已連線' : '未連線'}
          color={isConnected ? 'success' : 'error'}
        />
        <Button
          variant="contained"
          onClick={() => (isConnected ? close() : reconnect())}
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
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          發送訊息
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          接收到的訊息：
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {messageList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              尚無訊息
            </Typography>
          ) : (
            messageList.map((msg, index) => (
              <Box
                key={index}
                sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}
              >
                <pre
                  style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}
                >
                  {typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)}
                </pre>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </section>
  );
}
