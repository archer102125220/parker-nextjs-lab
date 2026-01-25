'use client';
import { useMemo, useCallback, type ReactNode } from 'react';
import Image from 'next/image';
import type { SxProps } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useAppDispatch, useAppSelector } from '@/store';

import type { ThemeType } from '@/styles/theme';
import type { messageType } from '@/store/slices/systemSlice';

import { I18nList } from '@/components/Layout/I18nList';
import { LinkBox } from '@/components/Link/Box';
import { GoBack } from '@/components/Layout/GoBack';
import { PageLoading } from '@/components/PageLoading';
import { Message } from '@/components/Message';

import { useNonce } from '@/components/Providers/NonceProvider';

import './header.scss';

interface HeaderProps {
  nonce?: string;
  className?: string;
  sx?: SxProps<ThemeType> | undefined;
}

export function Header(props: HeaderProps): ReactNode {
  // const { className, nonce } = props;
  const { className, nonce: _nonce, sx } = props;
  const contextNonce = useNonce();

  const dispatch = useAppDispatch();

  const nonce = useAppSelector<string>((state) => state.system.nonce);
  const systemName = useAppSelector<string>((state) => state.system.systemName);
  const loading = useAppSelector<boolean>((state) => state.system.loading);
  const messageState = useAppSelector<messageType>(
    (state) => state.system.message
  );

  const finalNonce = useMemo(
    () => _nonce || contextNonce || nonce,
    [nonce, contextNonce, _nonce]
  );

  const resetMessageState = useCallback(
    () => dispatch({ type: 'system/message_reset' }),
    [dispatch]
  );

  // console.log(JSON.stringify({ HeaderNonce: nonce, _nonce }));

  return (
    <Toolbar
      component="nav"
      role="navigation"
      aria-label="Main navigation"
      className={`header-toolbar ${className || ''}`}
      sx={sx}
      nonce={finalNonce}
    >
      <PageLoading nonce={finalNonce} loading={loading} />
      <GoBack nonce={finalNonce} />
      <Message
        nonce={finalNonce}
        messageState={messageState}
        resetMessageState={resetMessageState}
      />
      <Typography
        variant="h6"
        component="div"
        sx={{ flex: 1 }}
        nonce={finalNonce}
      >
        <LinkBox
          href="/"
          className="header-title"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
          nonce={finalNonce}
        >
          <Image
            src="/img/icon/Next.jsLab.v.03.webp"
            alt="Parker's Next.js Lab"
            width={50}
            height={50}
            className="header-logo"
          />
          <p>{systemName}</p>
        </LinkBox>
      </Typography>

      <I18nList />
    </Toolbar>
  );
}
export default Header;
