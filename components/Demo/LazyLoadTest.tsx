'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Typography, Box, Alert } from '@mui/material';
import { useLazyLoad } from '@/hooks/useLazyLoad';

import style from '@/app/[locale]/directive-effects/lazyload-test/page.module.scss';

export default function LazyLoadTestClient(): React.ReactNode {
  // Create refs for native img demos
  const nativeBasicRef = useRef<HTMLImageElement>(null);
  const nativeRootMarginRef = useRef<HTMLImageElement>(null);
  const nativeErrorRef = useRef<HTMLImageElement>(null);

  // Create refs for Next.js Image demos
  const nextjsRef = useRef<HTMLImageElement>(null);

  // Native img demos
  const nativeBasic = useLazyLoad(
    nativeBasicRef,
    '/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg'
  );

  const nativeRootMargin = useLazyLoad(
    nativeRootMarginRef,
    '/img/test-img/1499231493_936.gif',
    { rootMargin: '100px' }
  );

  const nativeError = useLazyLoad(
    nativeErrorRef,
    '/img/non-existent-image.jpg',
    {
      errorImg:
        '/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg',
      onError: (e) => console.log('Image failed to load', e)
    }
  );

  // Next.js Image demo
  const nextjsDemo = useLazyLoad(
    nextjsRef,
    '/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg'
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        useLazyLoad Hook 測試
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        此 Hook 使用 Intersection Observer API
        實作懶載入功能，當圖片進入視窗時才開始載入。 向下滾動觀察圖片載入效果。
      </Alert>

      <Alert severity="warning" sx={{ mb: 3 }}>
        注意：Next.js Image 組件本身已有內建 lazy loading。此 Hook
        適用於需要更精細控制的場景 （如自訂 loading/error 圖片、自訂 rootMargin
        等），或搭配原生 img 標籤使用。
      </Alert>

      {/* Section: Next.js Image built-in */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        一、Next.js Image 內建功能
      </Typography>

      <Box className={style['lazyload_test_page-section']}>
        <Typography variant="h6" gutterBottom>
          Next.js Image 內建 lazy loading (對照組)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Next.js Image 組件預設就有 lazy loading 功能，無需額外 Hook。
        </Typography>
        <Image
          src="/img/test-img/1e0ef282c7831f762deb4b4ded8592d5ff7962d832cebcf11709ae670e721560.jpg"
          alt="Next.js Image with built-in lazy loading"
          width={600}
          height={400}
          className={style['lazyload_test_page-demo_image']}
        />
      </Box>

      <Box className={style['lazyload_test_page-section']}>
        <Typography variant="h6" gutterBottom>
          Next.js Image 搭配 useLazyLoad
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          若需要自訂控制，可搭配 useLazyLoad 使用（需設定 unoptimized）
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          狀態:{' '}
          {nextjsDemo.isLoading
            ? '載入中...'
            : nextjsDemo.isLoaded
              ? '已載入'
              : '未載入'}
        </Typography>
        <Image
          ref={nextjsRef}
          src="/img/placeholder.png"
          alt="Next.js Image with useLazyLoad"
          width={600}
          height={400}
          className={style['lazyload_test_page-demo_image']}
          unoptimized
        />
      </Box>

      {/* Spacer */}
      <Box
        sx={{
          height: '30vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          ↓ 向下滾動查看原生 img 標籤範例 ↓
        </Typography>
      </Box>

      {/* Section: Native img */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        二、原生 img 標籤搭配 useLazyLoad
      </Typography>

      <Box className={style['lazyload_test_page-section']}>
        <Typography variant="h6" gutterBottom>
          1. 基本懶載入
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          使用原生 img 標籤搭配 useLazyLoad Hook
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          狀態:{' '}
          {nativeBasic.isLoading
            ? '載入中...'
            : nativeBasic.isLoaded
              ? '已載入'
              : '未載入'}
        </Typography>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={nativeBasicRef}
          className={style['lazyload_test_page-image']}
          alt="Native img basic lazy load"
        />
      </Box>

      {/* Spacer */}
      <Box
        sx={{
          height: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant="body1" color="text.secondary">
          ↓ 繼續向下滾動 ↓
        </Typography>
      </Box>

      <Box className={style['lazyload_test_page-section']}>
        <Typography variant="h6" gutterBottom>
          2. 配合 rootMargin 提前載入
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          使用 rootMargin: 100px，圖片會在進入視窗 100px 前開始載入
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          狀態:{' '}
          {nativeRootMargin.isLoading
            ? '載入中...'
            : nativeRootMargin.isLoaded
              ? '已載入'
              : '未載入'}
        </Typography>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={nativeRootMarginRef}
          className={`${style['lazyload_test_page-image']} ${style['lazyload_test_page-image--gif']}`}
          alt="Native img with rootMargin"
        />
      </Box>

      <Box className={style['lazyload_test_page-section']}>
        <Typography variant="h6" gutterBottom>
          3. 錯誤處理 (載入失敗時顯示備用圖片)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          此範例故意載入不存在的圖片，會自動顯示備用圖片
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          狀態:{' '}
          {nativeError.hasError
            ? '載入失敗，已顯示備用圖片'
            : nativeError.isLoaded
              ? '已載入'
              : '載入中...'}
        </Typography>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={nativeErrorRef}
          className={style['lazyload_test_page-image']}
          alt="Native img with error handling"
        />
      </Box>
    </>
  );
}
