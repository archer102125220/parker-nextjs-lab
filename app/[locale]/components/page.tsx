import Box from '@mui/material/Box';

import LinkButton from '@/components/Link/Button';

export default function ComponentsPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <LinkButton href="/components/dialog">Dialog 元件</LinkButton>
      <LinkButton href="/components/swiper-js">SwiperJs 元件</LinkButton>
    </Box>
  );
}
