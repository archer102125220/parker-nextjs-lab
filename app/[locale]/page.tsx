import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

import { LinkButton } from '@/components/Link/Button';
import GTMScnOpen from '@/components/Google/GTMScnOpen';

function Locale(): ReactNode {
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
      <LinkButton href="/components">自定義組件列表</LinkButton>
      <LinkButton href="/firebase">Firebase 整合測試</LinkButton>
    </Box>
  );
}

export default Locale;
