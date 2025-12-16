'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { Typography, Paper, Button, TextField, Alert } from '@mui/material';

import '@/app/[locale]/web-rtc/web-rtc.scss';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function WebRTCSocketIOPage(): React.ReactNode {
  const router = useRouter();
  const locale = useLocale();
  const [roomId, setRoomId] = useState('');

  const isValidRoomId = roomId === '' || UUID_PATTERN.test(roomId);
  const disabledJoinLink = !roomId || !UUID_PATTERN.test(roomId);

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    router.push(`/${locale}/web-rtc/socket-io/room/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!disabledJoinLink) {
      router.push(`/${locale}/web-rtc/socket-io/room/${roomId}`);
    }
  };

  return (
    <section className="web_rtc_room_page">
      <Typography variant="h5" gutterBottom>
        WebRTC - Socket.IO 實作
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        className="web_rtc_room_page-description"
      >
        配合 Socket.IO 做為 Signaling Server 實作
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        注意：Socket.IO 在 serverless 環境（如
        Vercel）可能無法正常運作。建議在本地開發環境測試。
      </Alert>

      <div className="web_rtc_room_page-context">
        <Paper className="web_rtc_room_page-context-initiate" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            建立新房間
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleCreateRoom}
            sx={{ height: 80 }}
          >
            建立視訊聊天
          </Button>
        </Paper>

        <Paper className="web_rtc_room_page-context-join" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            加入現有房間
          </Typography>
          <TextField
            fullWidth
            label="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="輸入房間 UUID"
            error={!isValidRoomId}
            helperText={!isValidRoomId ? '無效的房間 ID 格式' : ''}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={disabledJoinLink}
            onClick={handleJoinRoom}
          >
            加入視訊聊天
          </Button>
        </Paper>
      </div>
    </section>
  );
}
