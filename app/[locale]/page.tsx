import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import Box from '@mui/material/Box';

import { LinkButton } from '@/components/Link/Button';
import GTMScnOpen from '@/components/Google/GTMScnOpen';

async function Locale(): Promise<ReactNode> {
  const nonce = (await headers()).get('x-nonce') || '';

  return (
    <Box
      nonce={nonce}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <GTMScnOpen />
      <LinkButton nonce={nonce} href="/components">
        自定義組件列表
      </LinkButton>
      <LinkButton nonce={nonce} href="/firebase">
        Firebase 整合測試
      </LinkButton>
    </Box>
  );
}

export default Locale;
