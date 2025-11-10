'use client';
import type { ReactNode } from 'react';
import { useCallback, useRef, useState, useEffect } from 'react';
import {
  useLocale
  // useTranslations
} from 'next-intl';

import { usePathname } from 'next/navigation';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useAppSelector } from '@/store';

import LinkButton from '@/components/Link/Button';

export function I18nList(): ReactNode {
  const pathname = usePathname();
  const locale = useLocale();
  // const t = useTranslations();
  const nonce = useAppSelector<string>((state) => state.system.nonce);
  console.log(JSON.stringify({ I18nListNonce: nonce }));

  const triggerRef = useRef<HTMLButtonElement>(null);

  const [clientNonce, setClientNonce] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    setMenuOpen(true);
  }, []);
  const handleClose = useCallback(() => {
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (typeof nonce === 'string' && nonce !== '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClientNonce(nonce);
    }
  }, [nonce]);

  return (
    <div>
      <Button ref={triggerRef} onClick={handleOpen} nonce={clientNonce}>
        {/* {t(locale)} */}
        {locale === 'zh-tw' ? '中文' : 'English'}
      </Button>
      {/*  https://mui.com/material-ui/react-menu/ */}
      <Menu
        // TODO
        // eslint-disable-next-line react-hooks/refs
        anchorEl={triggerRef.current}
        nonce={clientNonce}
        open={menuOpen}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
      >
        <MenuItem nonce={clientNonce} onClick={handleClose}>
          <LinkButton
            color="inherit"
            locale="zh-tw"
            replace={true}
            nonce={nonce}
            href={pathname.replace(/^\/zh-tw|^\/en/gi, '') || '/'}
            sx={{
              fontWeight: pathname.startsWith('/zh-tw') ? 'bold' : 'normal',
              color: (theme) =>
                pathname.startsWith('/zh-tw')
                  ? theme.palette.primary.main
                  : null
            }}
          >
            中文
            {/* {t('zh-tw')} */}
          </LinkButton>
        </MenuItem>
        <MenuItem nonce={clientNonce} onClick={handleClose}>
          <LinkButton
            color="inherit"
            locale="en"
            replace={true}
            nonce={nonce}
            href={pathname.replace(/^\/zh-tw|^\/en/gi, '') || '/'}
            sx={{
              fontWeight: pathname.startsWith('/en') ? 'bold' : 'normal',
              color: (theme) =>
                pathname.startsWith('/en') ? theme.palette.primary.main : null
            }}
          >
            English
            {/* {t('en')} */}
          </LinkButton>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default I18nList;
