'use client';

import { useState, type ReactNode, type FormEvent } from 'react';
import { useNextRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { Typography, Paper, Button, TextField, Alert } from '@mui/material';

import './index.scss';

// UUID v4 regex pattern
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface WebRTCRoomEntryCardProps {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Alert message */
  alertMessage: string;
  /** Alert severity */
  alertSeverity?: 'error' | 'warning' | 'info' | 'success';
  /** Base path for room navigation (e.g., '/web-rtc/socket-io/room') */
  roomBasePath: string;
  /** Root CSS class name for the page (for DevTools identification) */
  pageClassName?: string;
}

export default function WebRTCRoomEntryCard({
  title,
  description,
  alertMessage,
  alertSeverity = 'warning',
  roomBasePath,
  pageClassName
}: WebRTCRoomEntryCardProps): ReactNode {
  const router = useNextRouter();
  const locale = useLocale();
  const [roomId, setRoomId] = useState('');

  const isValidRoomId = roomId === '' || UUID_PATTERN.test(roomId);
  const disabledJoinLink = !roomId || !UUID_PATTERN.test(roomId);

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    router.push(`/${locale}${roomBasePath}/${newRoomId}`);
  };

  const handleJoinRoom = (e?: FormEvent) => {
    e?.preventDefault();
    if (!disabledJoinLink) {
      router.push(`/${locale}${roomBasePath}/${roomId}`);
    }
  };

  // Combine page-specific class with component's internal class
  const rootClassName = pageClassName
    ? `${pageClassName} web_rtc_room_entry_card`
    : 'web_rtc_room_entry_card';

  return (
    <section className={rootClassName}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        className="web_rtc_room_entry_card-description"
      >
        {description}
      </Typography>

      <Alert severity={alertSeverity} sx={{ mb: 3 }}>
        {alertMessage}
      </Alert>

      <div className="web_rtc_room_entry_card-context">
        <Paper
          className="web_rtc_room_entry_card-context-initiate"
          sx={{ p: 2 }}
        >
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

        <Paper className="web_rtc_room_entry_card-context-join" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            加入現有房間
          </Typography>
          <form onSubmit={handleJoinRoom}>
            <TextField
              fullWidth
              label="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="輸入房間 UUID 後按 Enter"
              error={!isValidRoomId}
              helperText={!isValidRoomId ? '無效的房間 ID 格式' : ''}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={disabledJoinLink}
            >
              加入視訊聊天
            </Button>
          </form>
        </Paper>
      </div>
    </section>
  );
}
