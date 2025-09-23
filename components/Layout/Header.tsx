'use client';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import Image from 'next/image';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useAppDispatch, useAppSelector } from '@/store';

import type { messageType } from '@/store/slices/systemSlice';

import { I18nList } from '@/components/Layout/I18nList';
import { LinkBox } from '@/components/Link/Box';
import { GoBack } from '@/components/GoBack';
import { PageLoading } from '@/components/PageLoading';
import { Message } from '@/components/Message';

export function Header(): ReactNode {
  const dispatch = useAppDispatch();

  const systemName = useAppSelector<string>((state) => state.system.systemName);
  const loading = useAppSelector<boolean>((state) => state.system.loading);
  const messageState = useAppSelector<messageType>(
    (state) => state.system.message
  );

  const resetMessageState = useCallback(
    () => dispatch({ type: 'system/message_reset' }),
    [dispatch]
  );

  return (
    <Toolbar>
      <PageLoading loading={loading} />
      <GoBack />
      <Message
        messageState={messageState}
        resetMessageState={resetMessageState}
      />
      <Typography variant="h6" component="div" sx={{ flex: 1 }}>
        <LinkBox
          href="/"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Image
            src="/img/icon/Next.jsLab.v.01.svg"
            alt="Parker's Next.js Lab"
            width={50}
            height={50}
          />
          <p>{systemName}</p>
        </LinkBox>
      </Typography>

      <I18nList />
    </Toolbar>
  );
}
export default Header;
