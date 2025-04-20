'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/store';
import { Link } from '@/i18n/navigation';

export default function Header() {
  const pathname = usePathname();
  const systemName = useAppSelector((state) => state.system.systemName);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            {systemName}
          </Link>
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={Link}
            href="/"
            locale="zh-tw"
            sx={{
              fontWeight: pathname.startsWith('/zh-tw') ? 'bold' : 'normal'
            }}
          >
            中文
          </Button>
          <Button
            color="inherit"
            component={Link}
            href="/"
            locale="en"
            sx={{ fontWeight: pathname.startsWith('/en') ? 'bold' : 'normal' }}
          >
            English
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
