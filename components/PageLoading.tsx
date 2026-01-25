'use client';
import { useMemo, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import { useNonce } from '@/components/Providers/NonceProvider';

interface PageLoadingProps {
  loading: boolean;
  nonce?: string;
}

export function PageLoading(props: Readonly<PageLoadingProps>): ReactNode {
  const { loading = false, nonce } = props;
  const contextNonce = useNonce();

  const finalNonce = useMemo(
    () => nonce || contextNonce,
    [nonce, contextNonce]
  );

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
      nonce={finalNonce}
    >
      <LinearProgress color="primary" nonce={finalNonce} />
    </Box>
  ) : (
    <></>
  );
}

export default PageLoading;
