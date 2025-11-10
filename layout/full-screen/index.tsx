import type { ReactNode } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';

import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

import '@/layout/full-screen/layout.scss';

interface FullScreenLayoutProps {
  children: ReactNode;
  nonce?: string;
}

export function FullScreenLayout(props: FullScreenLayoutProps): ReactNode {
  const { children, nonce } = props;

  console.log(JSON.stringify({ DefaultLayoutNonce: nonce }));

  return (
    <>
      <CssBaseline />
      <Box
        className="full_screen_layout"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh'
        }}
      >
        <Header
          nonce={nonce}
          sx={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 3,
            backgroundColor: '#f8f9fa'
          }}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            paddingTop: 0
          }}
        >
          <Container maxWidth="lg" sx={{ padding: 0 }}>
            {children}
          </Container>
        </Box>
        <Footer nonce={nonce} />
      </Box>
    </>
  );
}

export default FullScreenLayout;
