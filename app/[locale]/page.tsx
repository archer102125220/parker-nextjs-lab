import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import Box from '@mui/material/Box';

import { LinkButton } from '@/components/Link/Button';
import GTMScnOpen from '@/components/Google/GTMScnOpen';

import { DefaultLayout } from '@/layout/default';

async function Locale(): Promise<ReactNode> {
  const nonce = (await headers()).get('x-nonce') || '';

  // console.log(JSON.stringify({ LocalePageNonce: nonce }));

  return (
    <DefaultLayout nonce={nonce}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}
      >
        <GTMScnOpen />
        {/* 核心功能 */}
        <LinkButton href="/components" nonce={nonce}>
          自定義組件列表
        </LinkButton>
        <LinkButton href="/firebase" nonce={nonce}>
          Firebase 整合測試
        </LinkButton>
        <LinkButton href="/css-drawing" nonce={nonce}>
          CSS 繪圖相關測試
        </LinkButton>

        {/* 即時通訊 */}
        <LinkButton href="/web-rtc" nonce={nonce}>
          WebRTC 視訊聊天
        </LinkButton>
        <LinkButton href="/socket-test" nonce={nonce}>
          Socket.IO / WebSocket 測試
        </LinkButton>
        <LinkButton href="/server-sent-event-test" nonce={nonce}>
          Server-Sent Events 測試
        </LinkButton>

        {/* AI / 裝置 */}
        <LinkButton href="/face-swap" nonce={nonce}>
          AI 換臉
        </LinkButton>
        <LinkButton href="/web-cam" nonce={nonce}>
          Web Camera 測試
        </LinkButton>
        <LinkButton href="/web-authn" nonce={nonce}>
          WebAuthn 身份驗證
        </LinkButton>

        {/* 開發測試 */}
        <LinkButton href="/hooks-test" nonce={nonce}>
          Hooks 測試
        </LinkButton>
        <LinkButton href="/directive-effects" nonce={nonce}>
          Directive Effects
        </LinkButton>
        <LinkButton href="/route" nonce={nonce}>
          路由測試
        </LinkButton>
      </Box>
    </DefaultLayout>
  );
}

export default Locale;
