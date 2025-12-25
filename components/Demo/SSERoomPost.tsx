'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useNextRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import {
  Typography,
  Paper,
  Button,
  TextField,
  Chip,
  Alert
} from '@mui/material';
import { usePostEventSource } from '@/hooks/usePostEventSource';
import styles from '@/app/[locale]/server-sent-event-test/room-post/[[...uuId]]/page.module.scss';

export default function SSERoomPost(): React.ReactNode {
  const router = useNextRouter();
  const params = useParams();
  const locale = useLocale();
  const uuIdParam = params?.uuId;
  const roomId = Array.isArray(uuIdParam) ? uuIdParam[0] : uuIdParam;

  const [messageList, setMessageList] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [newRoomId, setNewRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    setMessageList((prev) => [...prev, event.data]);
  }, []);

  const handleOpen = useCallback(() => {
    setIsConnected(true);
  }, []);

  const handleError = useCallback(() => {
    setIsConnected(false);
  }, []);

  const postEventSource = usePostEventSource({
    channel: roomId ? `/room-post/${roomId}` : '/room-post',
    open: handleOpen,
    error: handleError,
    message: handleMessage,
    postData: { roomId }
  });

  const handleCreateRoom = () => {
    const id = newRoomId.trim() || uuidv4();
    router.push(`/${locale}/server-sent-event-test/room-post/${id}`);
  };

  const handleDisconnect = () => {
    if (postEventSource.current?.croe) {
      postEventSource.current.croe.close();
      setIsConnected(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !roomId) return;
    
    try {
      const response = await fetch(`/server-sent-event/room/${roomId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-' + Math.random().toString(36).substr(2, 9),
          message: inputMessage
        })
      });
      
      if (response.ok) {
        setInputMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCopyId = async () => {
    if (!roomId) return;
    await navigator.clipboard.writeText(roomId);
  };

  const handleCopyUrl = async () => {
    if (!roomId) return;
    await navigator.clipboard.writeText(window.location.href);
  };

  if (!roomId) {
    return (
      <>
        <Typography variant="h5" gutterBottom>
          Server-Sent Events 房間測試 (POST)
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          請建立或加入一個房間來測試 SSE 群組功能
        </Alert>

        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            建立新房間
          </Typography>
          <div className={styles['sse_room_post_page-create_form']}>
            <TextField
              fullWidth
              size="small"
              value={newRoomId}
              onChange={(e) => setNewRoomId(e.target.value)}
              placeholder="輸入房間 ID（留空將自動生成）"
            />
            <Button variant="contained" onClick={handleCreateRoom}>
              建立房間
            </Button>
          </div>
        </Paper>
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Server-Sent Events 房間測試 (POST)
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        使用 Server-Sent Events 進行即時訊息傳遞
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#fafafa' }}>
        <div className={styles['sse_room_post_page-room_info']}>
          <div>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              房間 ID
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 500, color: 'primary.main' }}>
              {roomId}
            </Typography>
          </div>
          <div className={styles['sse_room_post_page-action_buttons']}>
            <Button size="small" variant="outlined" onClick={handleCopyId}>
              📋 複製 ID
            </Button>
            <Button size="small" variant="outlined" onClick={handleCopyUrl}>
              🔗 複製 URL
            </Button>
          </div>
        </div>
      </Paper>

      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <div className={styles['sse_room_post_page-controls']}>
          <Chip
            label={isConnected ? '已連線' : '未連線'}
            color={isConnected ? 'success' : 'default'}
            size="small"
          />
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDisconnect}
            disabled={!isConnected}
          >
            斷線
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => router.push(`/${locale}/server-sent-event-test/room-post`)}
          >
            離開房間
          </Button>
        </div>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          發送訊息
        </Typography>
        <form onSubmit={handleSendMessage} className={styles['sse_room_post_page-message_form']}>
          <TextField
            fullWidth
            size="small"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="輸入訊息後按 Enter 發送..."
            disabled={!isConnected}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!isConnected || !inputMessage.trim()}
          >
            發送
          </Button>
        </form>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          接收到的訊息
        </Typography>
        <div className={styles['sse_room_post_page-messages']}>
          {messageList.length === 0 ? (
            <div className={styles['sse_room_post_page-messages-empty']}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                尚無訊息
              </Typography>
              <Typography variant="body2" color="text.secondary">
                發送訊息後會顯示在這裡
              </Typography>
            </div>
          ) : (
            messageList.map((msg, index) => (
              <div key={index} className={styles['sse_room_post_page-messages-item']}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  訊息 #{index + 1}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-word' }}>
                  {msg}
                </Typography>
              </div>
            ))
          )}
        </div>
      </Paper>
    </>
  );
}
