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
      <LinkButton href="/components/banner-demo" sx={{ flexShrink: 0 }} nonce={nonce}>
        Banner 輪播組件
      </LinkButton>
      <LinkButton href="/components/countdown-test" sx={{ flexShrink: 0 }} nonce={nonce}>
        Countdown 倒數計時
      </LinkButton>
      <LinkButton href="/components/selector" sx={{ flexShrink: 0 }} nonce={nonce}>
        Selector 下拉選單
      </LinkButton>
      <LinkButton href="/components/phone-input" sx={{ flexShrink: 0 }} nonce={nonce}>
        PhoneInput 電話輸入
      </LinkButton>
      <LinkButton href="/components/image-upload-test" sx={{ flexShrink: 0 }} nonce={nonce}>
        ImageUpload 圖片上傳
      </LinkButton>
      <LinkButton href="/components/tab-test" sx={{ flexShrink: 0 }} nonce={nonce}>
        Tabs 分頁組件
      </LinkButton>
      <LinkButton href="/components/slide-in-panel" sx={{ flexShrink: 0 }} nonce={nonce}>
        SlideInPanel 滑入面板
      </LinkButton>
      <LinkButton href="/components/qr-code-test" sx={{ flexShrink: 0 }} nonce={nonce}>
        QRCode 組件
      </LinkButton>
      <LinkButton href="/components/switch-button" sx={{ flexShrink: 0 }} nonce={nonce}>
        SwitchButton 開關
      </LinkButton>
      <LinkButton href="/components/wang-editor-test" sx={{ flexShrink: 0 }} nonce={nonce}>
        WangEditor 富文本
      </LinkButton>
      <LinkButton href="/components/swiper-test" sx={{ flexShrink: 0 }} nonce={nonce}>
        SwiperCustom 輪播
      </LinkButton>
      <LinkButton href="/components/dialog" sx={{ flexShrink: 0 }}>
        Dialog 元件
      </LinkButton>
      <LinkButton
        href="/components/swiper-js"
        sx={{ flexShrink: 0 }}
        nonce={nonce}
      >
        SwiperJs 元件
      </LinkButton>
      <LinkButton
        href="/components/drawer"
        sx={{ flexShrink: 0 }}
        nonce={nonce}
      >
        Drawer 元件
      </LinkButton>
      <LinkButton
        href="/components/scroll-fetch"
        sx={{ flexShrink: 0 }}
        nonce={nonce}
      >
        下拉及無限滾動元件
      </LinkButton>
      <LinkButton
        href="/components/skeleton-loader"
        sx={{ flexShrink: 0 }}
        nonce={nonce}
      >
        載入骨架元件
      </LinkButton>
    </Box>
  );
}

export default ComponentsPage;
