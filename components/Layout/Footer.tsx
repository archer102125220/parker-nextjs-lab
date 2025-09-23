'use client';
import type { ReactNode } from 'react';
import { Box, Typography, BoxProps } from '@mui/material';
import { useAppSelector } from '@/store';

export function Footer(props: BoxProps): ReactNode {
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
      {...props}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} {systemName}
      </Typography>
    </Box>
  );
}
export default Footer;
