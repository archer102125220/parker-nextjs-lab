import type { ReactNode } from 'react';
import type { Metadata } from 'next';

import Box from '@mui/material/Box';

import LinkButton from '@/components/Link/Button';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '自製組件測試',
    description: '自製組件測試'
  };
}

function ComponentsPage(): ReactNode {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <GTMScnOpen />
      <LinkButton href="/components/dialog">Dialog 元件</LinkButton>
      <LinkButton href="/components/swiper-js">SwiperJs 元件</LinkButton>
    </Box>
  );
}

export default ComponentsPage;
