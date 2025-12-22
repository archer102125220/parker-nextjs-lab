'use client';

import { useState, useCallback } from 'react';
import { Typography, Paper, Button, Chip } from '@mui/material';

import { useEventSource } from '@/hooks/useEventSource';
import styles from './page.module.scss';

export default function SSEGlobalGetPage(): React.ReactNode {
  const [messageList, setMessageList] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    console.log('SSE message:', event.data);
    // Stringify the data to prevent React rendering errors
    const messageStr = typeof event.data === 'string' 
      ? event.data 
      : JSON.stringify(event.data);
    setMessageList((prev) => [...prev, messageStr]);
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
    channel: '/',
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
    <section className={styles.sse_global_get_page}>
      <Typography variant="h5" gutterBottom>
        Server-Sent Events 全域測試 (GET)
      </Typography>

      <div className={styles['sse_global_get_page-controls']}>
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
        <div className={styles['sse_global_get_page-message_list']}>
          {messageList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              尚無訊息
            </Typography>
          ) : (
            messageList.map((msg, index) => (
              <div key={index} className={styles['sse_global_get_page-message_list_item']}>
                <Typography variant="body2">{msg}</Typography>
              </div>
            ))
          )}
        </div>
      </Paper>
    </section>
  );
}
