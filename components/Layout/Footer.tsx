'use client';

import { Box, Typography } from '@mui/material';
import { useAppSelector } from '@/store';

export default function Footer() {
  const systemName = useAppSelector((state) => state.system.systemName);

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
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} {systemName}
      </Typography>
    </Box>
  );
} 