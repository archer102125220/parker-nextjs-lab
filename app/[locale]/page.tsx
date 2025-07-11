import Box from '@mui/material/Box';

import { LinkButton } from '@/components/Link/Button';

import GTMScnOpen from '@/components/Google/GTMScnOpen';

export default function Locale() {
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
    </Box>
  );
}
