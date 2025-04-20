'use client';

import type { ReactNode } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

interface DefaultLayoutClientProps {
  children: ReactNode;
}

export default function DefaultLayoutClient({
  children
}: DefaultLayoutClientProps) {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3
          }}
        >
          <Container maxWidth="lg">{children}</Container>
        </Box>
        <Footer />
      </Box>
    </>
  );
}
