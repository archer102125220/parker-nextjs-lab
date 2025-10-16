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
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <GTMScnOpen />
      <LinkButton href="/components/dialog" sx={{ flexShrink: 0 }}>
        Dialog 元件
      </LinkButton>
      <LinkButton href="/components/swiper-js" sx={{ flexShrink: 0 }}>
        SwiperJs 元件
      </LinkButton>
      <LinkButton href="/components/drawer" sx={{ flexShrink: 0 }}>
        Drawer 元件
      </LinkButton>
      <LinkButton href="/components/scroll-fetch" sx={{ flexShrink: 0 }}>
        下拉及無限滾動元件
      </LinkButton>
    </Box>
  );
}

export default ComponentsPage;
