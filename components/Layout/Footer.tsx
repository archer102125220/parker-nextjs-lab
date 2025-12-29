'use client';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';

import { Box, Typography, BoxProps } from '@mui/material';
import { useAppSelector } from '@/store';

import './footer.scss';

interface FooterProps extends BoxProps {
  nonce?: string;
}

export function Footer(props: FooterProps): ReactNode {
  const { nonce: _nonce, ...boxProps } = props;

  const nonce = useAppSelector<string>((state) => state.system.nonce);
  const systemName = useAppSelector<string>((state) => state.system.systemName);

  // console.log(JSON.stringify({ FooterNonce: nonce, _nonce }));
  const [clientNonce, setClientNonce] = useState<string>('');

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setClientNonce(nonce);
    }
  }, [nonce]);

  return (
    <Box
      component="footer"
      className="footer"
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
      <div className="footer-content">
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          className="footer-content-text"
          nonce={clientNonce}
          sx={{ mb: 1 }}
        >
          © {new Date().getFullYear()} {systemName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          className="footer-content-link_list"
          nonce={clientNonce}
        >
          <Link href="/about" className="footer-content-link_list-link">
            關於本站
          </Link>
          <span className="footer-content-link_list-separator">|</span>
          <a
            href="https://github.com/archer102125220/parker-nextjs-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-content-link_list-link"
          >
            GitHub
          </a>
        </Typography>
      </div>
    </Box>
  );
}
export default Footer;
