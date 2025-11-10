'use client';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';

import { Box, Typography, BoxProps } from '@mui/material';
import { useAppSelector } from '@/store';

interface FooterProps extends BoxProps {
  nonce?: string;
}

export function Footer(props: FooterProps): ReactNode {
  // const { nonce, ...boxProps } = props;
  const { nonce: _nonce, ...boxProps } = props;

  const nonce = useAppSelector<string>((state) => state.system.nonce);
  const systemName = useAppSelector<string>((state) => state.system.systemName);

  console.log(JSON.stringify({ FooterNonce: nonce, _nonce }));
  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800]
      }}
      nonce={clientNonce}
      {...boxProps}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        nonce={clientNonce}
      >
        © {new Date().getFullYear()} {systemName}
      </Typography>
    </Box>
  );
}
export default Footer;
