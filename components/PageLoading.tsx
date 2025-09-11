import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface PageLoadingProps {
  loading: boolean;
}

export function PageLoading(props: Readonly<PageLoadingProps>): ReactNode {
  const { loading = false } = props;

  return loading === true ? (
    <Box
      sx={{
        position: 'absolute',
        width: '100vw',
        top: '0',
        left: '0',
        zIndex: 100
      }}
    >
      <LinearProgress color="primary" />
    </Box>
  ) : (
    <></>
  );
}

export default PageLoading;
