'use client';

// Immersive Layout
// 沈浸式佈局，適用於 VR/全景場景，無 Header/Footer

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { Box, CssBaseline, Fab } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { I18nList } from '@/components/Layout/I18nList';

import './layout.scss';

interface ImmersiveLayoutProps {
  children: ReactNode;
  nonce?: string;
  /** 返回按鈕顯示的路徑，若未指定則執行 router.back() */
  backHref?: string;
  /** 是否顯示返回按鈕，預設為 true */
  showBackButton?: boolean;
}

export function ImmersiveLayout(props: ImmersiveLayoutProps): ReactNode {
  const { children, showBackButton = true, backHref } = props;
  const router = useRouter();

  return (
    <>
      <CssBaseline />
      <Box className="immersive_layout">
        {/* 浮動返回按鈕 */}
        {showBackButton && (
          backHref ? (
            <Fab
              component={Link}
              href={backHref}
              size="small"
              className="immersive_layout-back_button"
              aria-label="返回"
              sx={{ position: 'fixed' }}
            >
              <ArrowBackIcon />
            </Fab>
          ) : (
            <Fab
              size="small"
              className="immersive_layout-back_button"
              aria-label="返回"
              sx={{ position: 'fixed' }}
              onClick={() => router.back()}
            >
              <ArrowBackIcon />
            </Fab>
          )
        )}

        {/* 主內容區域 */}
        <Box component="main" className="immersive_layout-content">
          {children}
        </Box>

        {/* 語言切換按鈕 */}
        <Box className="immersive_layout-i18n">
          <I18nList color="inherit" />
        </Box>
      </Box>
    </>
  );
}

export default ImmersiveLayout;
