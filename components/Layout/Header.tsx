'use client';
import type { ReactNode } from 'react';
import Image from 'next/image';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useAppSelector } from '@/store';

import I18nList from '@/components/Layout/I18nList';
import LinkBox from '@/components/Link/Box';
import GoBack from '@/components/GoBack';
import { PageLoading } from '@/components/PageLoading';

export function Header(): ReactNode {
  const systemName = useAppSelector((state) => state.system.systemName);

  const loading = useAppSelector((state) => state.system.loading);

  return (
    <Toolbar>
      <PageLoading loading={loading} />
      <GoBack />
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
