import Box from '@mui/material/Box';

import { LinkButton } from '@/components/Link/Button';

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
      <LinkButton href="/components">自定義組件列表</LinkButton>
    </Box>
  );
}
