'use client';
import { useState, useEffect, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface PageLoadingProps {
  loading: boolean;
  nonce?: string;
}

export function PageLoading(props: Readonly<PageLoadingProps>): ReactNode {
  const { loading = false, nonce } = props;

  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return loading === true ? (
    <Box
      sx={{
        position: 'absolute',
        minWidth: '100vw',
        top: '0',
        left: '0',
        right: '0',
        zIndex: 100
      }}
      nonce={clientNonce}
    >
      <LinearProgress color="primary" nonce={clientNonce} />
    </Box>
  ) : (
    <></>
  );
}

export default PageLoading;
