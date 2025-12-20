'use client';

import { useState, useCallback } from 'react';
import { Typography, Paper, Button, Chip } from '@mui/material';

import { useEventSource } from '@/hooks/useEventSource';

export default function SSEGlobalGetPage(): React.ReactNode {
  const [messageList, setMessageList] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    console.log('SSE message:', event.data);
    setMessageList((prev) => [...prev, event.data]);
  }, []);

  const handleOpen = useCallback(() => {
    console.log('SSE connected');
    setIsConnected(true);
  }, []);

  const handleError = useCallback(() => {
    console.error('SSE error');
    setIsConnected(false);
  }, []);

  const eventSource = useEventSource({
    channel: '/global',
    open: handleOpen,
    error: handleError,
    message: handleMessage
  });

  // Manual connection control
  const handleDisconnect = () => {
    if (eventSource.current?.croe) {
      eventSource.current.croe.close();
      setIsConnected(false);
    }
  };

  return (
    <section>
      <Typography variant="h5" gutterBottom>
        Server-Sent Events 全域測試 (GET)
      </Typography>

      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: 16,
          alignItems: 'center'
        }}
      >
        <Chip
          label={isConnected ? '已連線' : '未連線'}
          color={isConnected ? 'success' : 'error'}
        />
        <Button
          variant="outlined"
          onClick={handleDisconnect}
          disabled={!isConnected}
        >
          斷線
        </Button>
      </div>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          接收到的訊息：
        </Typography>
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {messageList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              尚無訊息
            </Typography>
          ) : (
            messageList.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 8,
                  padding: 8,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 4
                }}
              >
                <Typography variant="body2">{msg}</Typography>
              </div>
            ))
          )}
        </div>
      </Paper>
    </section>
  );
}
