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

  console.log(JSON.stringify({ DefaultLayoutNonce: nonce }));

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh'
        }}
      >
        <Header nonce={nonce} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 3
          }}
        >
          <Container maxWidth="lg">{children}</Container>
        </Box>
        <Footer nonce={nonce} />
      </Box>
    </>
  );
}

export default DefaultLayout;
