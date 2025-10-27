'use client';
import type { ReactNode } from 'react';
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
      {...boxProps}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} {systemName}
      </Typography>
    </Box>
  );
}
export default Footer;
