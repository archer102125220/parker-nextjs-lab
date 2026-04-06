'use client';
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
  type MouseEvent
} from 'react';
import {
  useLocale
  // useTranslations
} from 'next-intl';

import { usePathnameWithLocale } from '@/i18n/navigation';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { useAppSelector } from '@/store';

import LinkButton from '@/components/Link/Button';

import './i18n_list.scss';

interface I18nListProps {
  className?: string;
  nonce?: string;
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
}

export function I18nList(props: I18nListProps): ReactNode {
  const { className, color } = props;
  const pathname = usePathnameWithLocale(); // Includes locale: /zh-tw/...
  const locale = useLocale();
  // const t = useTranslations();
  const nonce = useAppSelector<string>((state) => state.system.nonce);
  // console.log(JSON.stringify({ I18nListNonce: nonce }));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const clientNonce = useMemo(
    () => (typeof nonce === 'string' && nonce !== '' ? nonce : ''),
    [nonce]
  );

  const handleOpen = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const isZhTw = useMemo(() => pathname.startsWith('/zh-tw'), [pathname]);
  const isEn = useMemo(() => pathname.startsWith('/en'), [pathname]);

  return (
    <div className="i18n_list">
      <Button
        onClick={handleOpen}
        className={`i18n_list-trigger ${className || ''}`}
        nonce={clientNonce}
        color={color}
      >
        {/* {t(locale)} */}
        {locale === 'zh-tw' ? '中文' : 'English'}
      </Button>
      {/*  https://mui.com/material-ui/react-menu/ */}
      <Menu
        anchorEl={anchorEl}
        className="i18n_list-menu"
        nonce={clientNonce}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
      >
        <MenuItem
          className="i18n_list-item"
          css-active={isZhTw ? 'true' : 'false'}
          nonce={clientNonce}
          onClick={handleClose}
        >
          <LinkButton
            color="inherit"
            locale="zh-tw"
            replace={true}
            className="i18n_list-link"
            nonce={nonce}
            href={pathname.replace(/^\/zh-tw|^\/en/gi, '') || '/'}
            sx={{
              fontWeight: isZhTw ? 'bold' : 'normal',
              color: (theme) => (isZhTw ? theme.palette.primary.main : null)
            }}
          >
            中文
            {/* {t('zh-tw')} */}
          </LinkButton>
        </MenuItem>
        <MenuItem
          className="i18n_list-item"
          css-active={isEn ? 'true' : 'false'}
          nonce={clientNonce}
          onClick={handleClose}
        >
          <LinkButton
            color="inherit"
            locale="en"
            replace={true}
            className="i18n_list-link"
            nonce={nonce}
            href={pathname.replace(/^\/zh-tw|^\/en/gi, '') || '/'}
            sx={{
              fontWeight: isEn ? 'bold' : 'normal',
              color: (theme) => (isEn ? theme.palette.primary.main : null)
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
