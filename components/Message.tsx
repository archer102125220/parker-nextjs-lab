'use client';
import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import type { SnackbarOrigin } from '@mui/material/Snackbar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// import { useAppSelector } from '@/store';
import type {
  messageType,
  messageTypText,
  messageTypeType
} from '@/store/slices/systemSlice';
import {
  MESSAGE_TYPE
  // systemSelectors
} from '@/store/slices/systemSlice';

export interface MessageProps {
  messageState: messageType;
  anchorOrigin?: SnackbarOrigin;
  nonce?: string;
  autoHideDuration?: number;
  width?: string | number;
  resetMessageState?: () => void;
}

export function Message(props: MessageProps): ReactNode {
  const {
    nonce,
    messageState = { text: '', type: 'success' },
    anchorOrigin = { vertical: 'top', horizontal: 'center' },
    autoHideDuration = 6000,
    width = '100%',
    resetMessageState = () => {}
  } = props;

  const [clientNonce, setClientNonce] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<messageTypText>('');
  const [messageType, setMessageType] = useState<messageTypeType>('success');

  // const messageContext = useAppSelector(systemSelectors.messageContext);
  // console.log({ messageContext });

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  useEffect(() => {
    const { text: _text = '', type: _type = 'success' } = messageState || {};
    // TODO
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const handleClose = useCallback(function _close() {
    setOpen(false);
  }, []);

  return (
    <Snackbar
      nonce={nonce}
      open={open}
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <MuiAlert
        nonce={clientNonce}
        severity={messageType}
        sx={{ width, alignItems: 'center' }}
        elevation={6}
        variant="filled"
        onClose={handleClose}
      >
        {messageText}
      </MuiAlert>
    </Snackbar>
  );
}

export default Message;
