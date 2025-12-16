'use client';

import { useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

import { useEventSource } from '@/hooks/useEventSource';

export default function SSERoomGetPage(): React.ReactNode {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const uuIdParam = params?.uuId;
  const roomId = Array.isArray(uuIdParam) ? uuIdParam[0] : uuIdParam;

  const [messageList, setMessageList] = useState<string[]>([]);
  const [newRoomId, setNewRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleMessage = useCallback((event: MessageEvent) => {
    console.log('SSE message:', event.data);
    setMessageList((prev) => [...prev, event.data]);
  }, []);

  const handleOpen = useCallback(() => {
    console.log('SSE room connected');
    setIsConnected(true);
  }, []);

  const handleError = useCallback(() => {
    console.error('SSE room error');
    setIsConnected(false);
  }, []);

  const eventSource = useEventSource({
    channel: roomId ? `/room/${roomId}` : '/room',
    open: handleOpen,
    error: handleError,
    message: handleMessage
  });

  const handleCreateRoom = () => {
    const id = newRoomId.trim() || uuidv4();
    router.push(`/${locale}/server-sent-event-test/room-get/${id}`);
  };

  const handleDisconnect = () => {
    if (eventSource.current?.croe) {
      eventSource.current.croe.close();
      setIsConnected(false);
    }
  };

  if (!roomId) {
    return (
      <section>
        <Typography variant="h5" gutterBottom>
          Server-Sent Events 房間測試 (GET)
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
      <Typography variant="h5" gutterBottom>
        Server-Sent Events 房間測試 (GET)
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        房間 ID: {roomId}
      </Alert>

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
        <Button
          variant="outlined"
          onClick={() =>
            router.push(`/${locale}/server-sent-event-test/room-get`)
          }
        >
          離開房間
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
