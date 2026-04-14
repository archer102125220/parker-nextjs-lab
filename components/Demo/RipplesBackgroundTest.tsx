'use client';

import { useState } from 'react';
import RipplesBackground from '@/components/Animation/RipplesBackground';
import style from '@/app/[locale]/animation/ripples-background/page.module.scss';

export default function RipplesBackgroundTest() {
  const [autoDrops, setAutoDrops] = useState(true);

  return (
    <>
      <div className={style['ripples_background_test_page-section']}>
        <h2 className={style['ripples_background_test_page-section-title']}>基本水波紋 (Basic Ripples)</h2>
        <p className={style['ripples_background_test_page-section-text']}>點擊或滑過圖片會有水波紋效果，也可以點擊下方按鈕開啟自動水滴效果。</p>
        <div className={style['ripples_background_test_page-section-controls']}>
          <button
            className={
              style['ripples_background_test_page-section-controls-toggle_btn']
            }
            css-is-active={autoDrops ? 'true' : 'false'}
            onClick={() => setAutoDrops(!autoDrops)}
          >
            {autoDrops ? '⏸ 停用自動水滴 (Disable Auto Drops)' : '▶ 啟用自動水滴 (Enable Auto Drops)'}
          </button>
        </div>
        <div
          className={style['ripples_background_test_page-section-image_container']}
        >
          <RipplesBackground
            className={
              style['ripples_background_test_page-section-image_container-img']
            }
            imageUrl="/img/test-img/hero-gradient.svg"
            autoDrops={autoDrops}
          >
            <p className={style['ripples_background_test_page-section-image_container-test_label']}>
              描述文字
            </p>
          </RipplesBackground>
        </div>
      </div>

      <div className={style['ripples_background_test_page-section']}>
        <h2 className={style['ripples_background_test_page-section-title']}>大水滴半徑 (Large Drops - Radius: 40)</h2>
        <div
          className={style['ripples_background_test_page-section-image_container']}
        >
          <RipplesBackground
            className={
              style['ripples_background_test_page-section-image_container-img']
            }
            imageUrl="/img/test-img/hero-gradient.svg"
            dropRadius={40}
            interactive={true}
          />
        </div>
      </div>
    </>
  );
}
