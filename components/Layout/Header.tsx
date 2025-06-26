import Image from 'next/image';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';

import { useAppSelector } from '@/store';

import I18nList from '@/components/Layout/I18nList';
import LinkBox from '@/components/Link/Box';
import GoBack from '@/components/GoBack';
// import LinkListItemButton from '@/components/Link/ListItemButton';

export default function Header() {
  const systemName = useAppSelector((state) => state.system.systemName);

  return (
    <Toolbar>
      <GoBack />
      <Typography variant="h6" component="div" sx={{ flex: 1 }}>
        <LinkBox
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
        </LinkBox>
      </Typography>

      {/* <List>
        <ListItem disablePadding>
          <LinkListItemButton
            color="inherit"
            href={pathname.replace(/^\/zh-tw|^\/en/gi, '') || '/'}
            locale="zh-tw"
            sx={{
              fontWeight: pathname.startsWith('/zh-tw') ? 'bold' : 'normal'
            }}
          >
            <ListItemText primary="中文" />
          </LinkListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <LinkListItemButton
            color="inherit"
            locale="en"
            href={pathname.replace(/^\/zh-tw|^\/en/gi, '') || '/'}
            sx={{ fontWeight: pathname.startsWith('/en') ? 'bold' : 'normal' }}
          >
            <ListItemText primary="English" />
          </LinkListItemButton>
        </ListItem>
      </List> */}
      <I18nList />
    </Toolbar>
  );
}
