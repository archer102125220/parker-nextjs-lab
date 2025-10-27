import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface PageLoadingProps {
  loading: boolean;
  nonce?: string;
}

export function PageLoading(props: Readonly<PageLoadingProps>): ReactNode {
  const { loading = false, nonce } = props;

  return loading === true ? (
    <Box
      nonce={nonce}
      sx={{
        position: 'absolute',
        minWidth: '100vw',
        top: '0',
        left: '0',
        right: '0',
        zIndex: 100
      }}
    >
      <LinearProgress nonce={nonce} color="primary" />
    </Box>
  ) : (
    <></>
  );
}

export default PageLoading;
