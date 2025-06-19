'use client';

import Image from 'next/image';
import { Toolbar, Typography, Button, Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import { Link } from '@/i18n/navigation';

export default function Header() {
  const pathname = usePathname();
  const systemName = useAppSelector((state) => state.system.systemName);

  console.log({ pathname });
  return (
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flex: 1 }}>
        <Box
          component={Link}
          href="/"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Image
            src="/img/icon/Next.jsLab.v.01.svg"
            alt="Parker's Next.js Lab"
            width={50}
            height={50}
          />
          <p>{systemName}</p>
        </Box>
      </Typography>
      <Box>
        <Button
          color="inherit"
          href={pathname.replace(/[zh\-tw]|en/ig, '') || '/'}
          locale="zh-tw"
          component={Link}
          sx={{
            fontWeight: pathname.startsWith('/zh-tw') ? 'bold' : 'normal'
          }}
        >
          中文
        </Button>
        <Button
          color="inherit"
          component={Link}
          locale="en"
          href={pathname.replace(/[zh\-tw]|en/ig, '') || '/'}
          sx={{ fontWeight: pathname.startsWith('/en') ? 'bold' : 'normal' }}
        >
          English
        </Button>
      </Box>
    </Toolbar>
  );
}
