'use client';
import type { ReactNode } from 'react';
import { Box, Typography, BoxProps } from '@mui/material';
import { useAppSelector } from '@/store';

export function Footer(props: BoxProps): ReactNode {
  const nonce = useAppSelector<string>((state) => state.system.nonce);
  const systemName = useAppSelector<string>((state) => state.system.systemName);

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
      nonce={nonce}
      {...props}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        nonce={nonce}
      >
        © {new Date().getFullYear()} {systemName}
      </Typography>
    </Box>
  );
}
export default Footer;
