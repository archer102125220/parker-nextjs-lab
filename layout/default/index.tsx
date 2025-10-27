import type { ReactNode } from 'react';
import { Box, Container, CssBaseline } from '@mui/material';

import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

interface DefaultLayoutProps {
  children: ReactNode;
  nonce?: string;
}

export function DefaultLayout(props: DefaultLayoutProps): ReactNode {
  const { children, nonce } = props;

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh'
        }}
        nonce={nonce}
      >
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3
          }}
          nonce={nonce}
        >
          <Container maxWidth="lg" nonce={nonce}>
            {children}
          </Container>
        </Box>
        <Footer />
      </Box>
    </>
  );
}

export default DefaultLayout;
