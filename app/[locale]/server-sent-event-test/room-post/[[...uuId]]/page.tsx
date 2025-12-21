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

export default function SSETestRoomPostPage(): React.ReactNode {
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
    console.log('SSE message:', event.data);
    setMessageList((prev) => [...prev, event.data]);
  }, []);

  const handleOpen = useCallback(() => {
    console.log('SSE room POST connected');
    setIsConnected(true);
  }, []);

  const handleError = useCallback(() => {
    console.error('SSE room POST error');
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
        console.log('Message sent successfully');
        setInputMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCopyId = async () => {
    if (!roomId) return;
    try {
      await navigator.clipboard.writeText(roomId);
      console.log('Room ID copied to clipboard');
    } catch (error) {
      console.error('Failed to copy room ID:', error);
    }
  };

  const handleCopyUrl = async () => {
    if (!roomId) return;
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      console.log('Room URL copied to clipboard');
    } catch (error) {
      console.error('Failed to copy room URL:', error);
    }
  };

  if (!roomId) {
    return (
      <section>
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
          <div style={{ display: 'flex', gap: 16 }}>
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
      </section>
    );
  }

  return (
    <section>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        Server-Sent Events 房間測試 (POST)
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        使用 Server-Sent Events 進行即時訊息傳遞
      </Typography>

      {/* Room Info Card */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#fafafa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              房間 ID
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 500, color: 'primary.main' }}>
              {roomId}
            </Typography>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              size="small" 
              variant="outlined"
              onClick={handleCopyId}
            >
              📋 複製 ID
            </Button>
            <Button 
              size="small" 
              variant="outlined"
              onClick={handleCopyUrl}
            >
              🔗 複製 URL
            </Button>
          </div>
        </div>
      </Paper>

      {/* Connection Status & Controls */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip
            label={isConnected ? '已連線' : '未連線'}
            color={isConnected ? 'success' : 'default'}
            size="small"
            sx={{ fontWeight: 500 }}
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

      {/* Message Input */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          發送訊息
        </Typography>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 12 }}>
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
            sx={{ minWidth: 80 }}
          >
            發送
          </Button>
        </form>
      </Paper>

      {/* Messages Display */}
      <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          接收到的訊息
        </Typography>
        <div 
          style={{ 
            maxHeight: 500, 
            overflow: 'auto',
            backgroundColor: '#fafafa',
            borderRadius: 4,
            padding: 16,
            border: '1px solid #e0e0e0'
          }}
        >
          {messageList.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px',
              color: '#9e9e9e'
            }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                尚無訊息
              </Typography>
              <Typography variant="body2" color="text.secondary">
                發送訊息後會顯示在這裡
              </Typography>
            </div>
          ) : (
            messageList.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  backgroundColor: 'white',
                  borderRadius: 4,
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  訊息 #{index + 1}
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontFamily: 'monospace',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg}
                </Typography>
              </div>
            ))
          )}
        </div>
      </Paper>
    </section>
  );
}
