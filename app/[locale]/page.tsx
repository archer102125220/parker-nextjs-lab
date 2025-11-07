import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import Box from '@mui/material/Box';

import { LinkButton } from '@/components/Link/Button';
import GTMScnOpen from '@/components/Google/GTMScnOpen';

async function Locale(): Promise<ReactNode> {
  const nonce = (await headers()).get('x-nonce') || '';

  console.log(JSON.stringify({ LocalePageNonce: nonce }));

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
      <LinkButton href="/components" nonce={nonce}>
        自定義組件列表
      </LinkButton>
      <LinkButton href="/firebase" nonce={nonce}>
        Firebase 整合測試
      </LinkButton>
      <LinkButton href="/css-drawing" nonce={nonce}>
        css繪圖相關測試
      </LinkButton>
    </Box>
  );
}

export default Locale;
