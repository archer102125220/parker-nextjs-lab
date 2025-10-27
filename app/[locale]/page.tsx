import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import Box from '@mui/material/Box';

import { LinkButton } from '@/components/Link/Button';
import GTMScnOpen from '@/components/Google/GTMScnOpen';

async function Locale(): Promise<ReactNode> {
  const nonce = (await headers()).get('x-nonce') || '';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
      }}
      nonce={`nonce-${nonce}`}
    >
      <GTMScnOpen />
      <LinkButton href="/components" nonce={`nonce-${nonce}`}>
        自定義組件列表
      </LinkButton>
      <LinkButton href="/firebase" nonce={`nonce-${nonce}`}>
        Firebase 整合測試
      </LinkButton>
    </Box>
  );
}

export default Locale;
