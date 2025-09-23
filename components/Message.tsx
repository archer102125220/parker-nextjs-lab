'use client';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import type { SnackbarOrigin } from '@mui/material/Snackbar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import type {
  messageType,
  messageTypText,
  messageTypeType
} from '@/store/slices/systemSlice';
import { MESSAGE_TYPE } from '@/store/slices/systemSlice';

export interface MessageProps {
  messageState: messageType;
  anchorOrigin?: SnackbarOrigin;
  autoHideDuration?: number;
  width?: string | number;
  resetMessageState?: () => void;
}

export function Message(props: MessageProps): ReactNode {
  const {
    messageState = { text: '', type: 'success' },
    anchorOrigin = { vertical: 'top', horizontal: 'center' },
    autoHideDuration = 6000,
    width = '100%',
    resetMessageState = () => {}
  } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<messageTypText>('');
  const [messageType, setMessageType] = useState<messageTypeType>('success');

  useEffect(() => {
    const { text: _text = '', type: _type = 'success' } = messageState || {};
    setMessageText(_text);
    setMessageType(_type || 'success');
    if (_text !== '' && MESSAGE_TYPE.includes(_type)) {
      setOpen(true);
    }
  }, [messageState]);

  useEffect(() => {
    if (open === false && typeof resetMessageState === 'function') {
      setTimeout(() => resetMessageState(), 100);
    }
  }, [open, resetMessageState]);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={messageType}
        sx={{ width, alignItems: 'center' }}
      >
        {messageText}
      </MuiAlert>
    </Snackbar>
  );
}

export default Message;
