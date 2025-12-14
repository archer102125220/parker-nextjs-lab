'use client';
import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';

import Checkbox from '@mui/material/Checkbox';

import { SkeletonLoader } from '@/components/SkeletonLoader';

import style from '@/app/[locale]/components/skeleton-loader/page.module.scss';

export function DemoSkeletonLoader(): ReactNode {
  const [loading, setLoading] = useState(true);

  const handleChangLoading = useCallback(
    function () {
      setLoading(!loading);
    },
    [loading]
  );

  return (
    <div className={style['skeleton_loader_page-content-skeleton']}>
      <label>
        <Checkbox
          value={true}
          checked={loading}
          onChange={handleChangLoading}
        />
        <span>開啟載入中狀態</span>
      </label>
      <SkeletonLoader
        loading={loading}
        className={style['skeleton_loader_page-content-skeleton']}
      >
        <p>載入完成區塊</p>
      </SkeletonLoader>
    </div>
  );
}

export default DemoSkeletonLoader;
