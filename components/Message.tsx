'use client';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import type { SnackbarOrigin } from '@mui/material/Snackbar';
import Snackbar from '@mui/material/Snackbar';
import type { OverridableStringUnion } from '@mui/types';
import type { AlertColor, AlertPropsColorOverrides } from '@mui/material/Alert';
import MuiAlert from '@mui/material/Alert';

export type messageType = OverridableStringUnion<
  AlertColor,
  AlertPropsColorOverrides
>;
export interface MessageProps {
  messageState: { text: string; type: messageType };
  anchorOrigin?: SnackbarOrigin;
  autoHideDuration?: number;
  width?: string | number;
  resetMessageState?: () => void;
}

const MESSAGE_TYPE = ['success', 'info', 'warning', 'error'];

export function Message(props: MessageProps): ReactNode {
  const {
    messageState = { text: '', type: 'success' },
    anchorOrigin = { vertical: 'top', horizontal: 'center' },
    autoHideDuration = 6000,
    width = '100%',
    resetMessageState = () => {}
  } = props;

  const [open, setOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<messageType>('success');

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
