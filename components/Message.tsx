'use client';
import { useReducer, useMemo, useEffect, useCallback, type ReactNode } from 'react';
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
    resetMessageState = () => { }
  } = props;

  // ✅ FIXED: Use useMemo instead of useEffect for nonce sync
  const clientNonce = useMemo(
    () => (typeof nonce === 'string' && nonce !== '' ? nonce : ''),
    [nonce]
  );

  // ✅ FIXED: Use useReducer for 4 related message states
  type MessageReducerState = {
    open: boolean;
    text: messageTypText;
    type: messageTypeType;
  };

  type MessageReducerAction =
    | { type: 'SHOW_MESSAGE'; payload: { text: messageTypText; messageType: messageTypeType } }
    | { type: 'HIDE_MESSAGE' };

  const messageReducer = (
    state: MessageReducerState,
    action: MessageReducerAction
  ): MessageReducerState => {
    switch (action.type) {
      case 'SHOW_MESSAGE':
        return {
          ...state,
          open: true,
          text: action.payload.text,
          type: action.payload.messageType
        };
      case 'HIDE_MESSAGE':
        return { ...state, open: false };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(messageReducer, {
    open: false,
    text: '',
    type: 'success'
  });

  // const messageContext = useAppSelector(systemSelectors.messageContext);
  // console.log({ messageContext });

  useEffect(() => {
    const { text: _text = '', type: _type = 'success' } = messageState || {};
    if (_text !== '' && MESSAGE_TYPE.includes(_type)) {
      dispatch({
        type: 'SHOW_MESSAGE',
        payload: { text: _text, messageType: _type || 'success' }
      });
    }
  }, [messageState]);

  useEffect(() => {
    if (state.open === false && typeof resetMessageState === 'function') {
      setTimeout(() => resetMessageState(), 100);
    }
  }, [state.open, resetMessageState]);

  const handleClose = useCallback(function _close() {
    dispatch({ type: 'HIDE_MESSAGE' });
  }, []);

  return (
    <Snackbar
      nonce={nonce}
      open={state.open}
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <MuiAlert
        nonce={clientNonce}
        severity={state.type}
        sx={{ width, alignItems: 'center' }}
        elevation={6}
        variant="filled"
        onClose={handleClose}
      >
        {state.text}
      </MuiAlert>
    </Snackbar>
  );
}

export default Message;
