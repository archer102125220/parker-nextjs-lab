'use client';
import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { Button, Stack, Typography, Box } from '@mui/material';

import Message from '@/components/Message';
import type { messageType } from '@/store/slices/systemSlice';

export function MessageDemo(): ReactNode {
  const [messageState, setMessageState] = useState<messageType>({
    text: '',
    type: 'success'
  });

  const handleShowSuccess = useCallback(() => {
    setMessageState({
      text: '✅ 操作成功！這是一個成功訊息。',
      type: 'success'
    });
  }, []);

  const handleShowError = useCallback(() => {
    setMessageState({
      text: '❌ 操作失敗！這是一個錯誤訊息。',
      type: 'error'
    });
  }, []);

  const handleShowWarning = useCallback(() => {
    setMessageState({
      text: '⚠️ 請注意！這是一個警告訊息。',
      type: 'warning'
    });
  }, []);

  const handleShowInfo = useCallback(() => {
    setMessageState({
      text: 'ℹ️ 提示訊息：這是一個資訊訊息。',
      type: 'info'
    });
  }, []);

  const resetMessageState = useCallback(() => {
    setMessageState({ text: '', type: 'success' });
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Message 訊息組件測試
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        展示不同類型的訊息提示功能
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 400, marginTop: 3 }}>
        <Typography variant="h6">基本用法</Typography>

        <Button
          variant="contained"
          color="success"
          onClick={handleShowSuccess}
          fullWidth
        >
          顯示成功訊息
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleShowError}
          fullWidth
        >
          顯示錯誤訊息
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={handleShowWarning}
          fullWidth
        >
          顯示警告訊息
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={handleShowInfo}
          fullWidth
        >
          顯示資訊訊息
        </Button>
      </Stack>

      <Box sx={{ marginTop: 4, padding: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          當前訊息狀態：
        </Typography>
        <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
          {JSON.stringify(messageState, null, 2)}
        </Typography>
      </Box>

      <Message
        messageState={messageState}
        resetMessageState={resetMessageState}
        autoHideDuration={3000}
      />
    </Box>
  );
}

export default MessageDemo;
