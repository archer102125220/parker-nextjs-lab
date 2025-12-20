import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

import Box from '@mui/material/Box';

import LinkButton from '@/components/Link/Button';
import GTMScnOpen from '@/components/Google/GTMScnOpen';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '自製組件測試',
    description: '自製組件測試'
  };
}

// Component links configuration
const COMPONENT_LINKS = [
  { href: '/components/banner-demo', label: 'Banner 輪播組件' },
  { href: '/components/countdown-test', label: 'Countdown 倒數計時' },
  { href: '/components/selector', label: 'Selector 下拉選單' },
  { href: '/components/phone-input', label: 'PhoneInput 電話輸入' },
  { href: '/components/image-upload-test', label: 'ImageUpload 圖片上傳' },
  { href: '/components/tab-test', label: 'Tabs 分頁組件' },
  { href: '/components/slide-in-panel', label: 'SlideInPanel 滑入面板' },
  { href: '/components/qr-code-test', label: 'QRCode 組件' },
  { href: '/components/switch-button', label: 'SwitchButton 開關' },
  { href: '/components/wang-editor-test', label: 'WangEditor 富文本' },
  { href: '/components/swiper-test', label: 'SwiperCustom 輪播' },
  { href: '/components/dialog', label: 'Dialog 元件' },
  { href: '/components/swiper-js', label: 'SwiperJs 元件' },
  { href: '/components/drawer', label: 'Drawer 元件' },
  { href: '/components/scroll-fetch', label: '下拉及無限滾動元件' },
  { href: '/components/skeleton-loader', label: '載入骨架元件' },
  { href: '/components/go-top', label: 'GoTop 回到頂部' },
  { href: '/components/youtube-test', label: 'Youtube 播放器' },
  { href: '/components/virtual-scroller', label: 'Virtual Scroller 虛擬滾動' },
  { href: '/components/enter-label', label: 'Enter Label 打字機動畫' }
] as const;

async function ComponentsPage(): Promise<ReactNode> {
  const nonce = (await headers()).get('x-nonce') || '';

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
      {COMPONENT_LINKS.map((link) => (
        <LinkButton
          key={link.href}
          href={link.href}
          sx={{ flexShrink: 0 }}
          nonce={nonce}
        >
          {link.label}
        </LinkButton>
      ))}
    </Box>
  );
}

export default ComponentsPage;
