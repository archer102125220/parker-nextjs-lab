'use client';

import { useState, useCallback } from 'react';
import { Typography, Paper, Button, TextField, Chip } from '@mui/material';

import { usePostEventSource } from '@/hooks/usePostEventSource';
import styles from './page.module.scss';

export default function SSEGlobalPostPage(): React.ReactNode {
  const [messageList, setMessageList] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
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
    console.log('SSE POST connected');
    setIsConnected(true);
  }, []);

  const handleError = useCallback(() => {
    console.error('SSE POST error');
    setIsConnected(false);
  }, []);

  const postEventSource = usePostEventSource({
    channel: '/',
    open: handleOpen,
    error: handleError,
    message: handleMessage,
    postData: { message: inputMessage }
  });

  // Manual connection control
  const handleDisconnect = () => {
    if (postEventSource.current?.croe) {
      postEventSource.current.croe.close();
      setIsConnected(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    // For POST SSE, the message is sent via the postData in config
    // Reconnect with new message
    if (postEventSource.current?.croe) {
      postEventSource.current.croe.close();
    }
    setInputMessage('');
  };

  return (
    <section className={styles.sse_global_post_page}>
      <Typography variant="h5" gutterBottom>
        Server-Sent Events Post 全域測試
      </Typography>

      <div className={styles['sse_global_post_page-controls']}>
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

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          發送訊息
        </Typography>
        <div className={styles['sse_global_post_page-message_form']}>
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
        <div className={styles['sse_global_post_page-message_list']}>
          {messageList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              尚無訊息
            </Typography>
          ) : (
            messageList.map((msg, index) => (
              <div key={index} className={styles['sse_global_post_page-message_list_item']}>
                <Typography variant="body2">{msg}</Typography>
              </div>
            ))
          )}
        </div>
      </Paper>
    </section>
  );
}
