'use client';

import { useState } from 'react';
import Banner from '@/components/Banner';
import type { BannerItem } from '@/components/Banner';
import style from '@/app/[locale]/components/banner-demo/page.module.scss';

export default function BannerDemoClient() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners: BannerItem[] = [
    {
      id: 1,
      image: '/img/test-img/pexels-maxfrancis-2246476.jpg',
      title: 'Banner 1',
      description: '這是第一個 Banner 的描述'
    },
    {
      id: 2,
      image: '/img/test-img/53818685860_7a896e1bde_h.jpg',
      title: 'Banner 2',
      description: '這是第二個 Banner 的描述'
    },
    {
      id: 3,
      image:
        '/img/test-img/pngtree-green-field-landscape-wallpapers-picture-image_3163831.jpg',
      title: 'Banner 3',
      description: '這是第三個 Banner 的描述'
    },
    {
      id: 4,
      image: '/img/test-img/kirby-game-wallpaper-2560x1600_7.jpg',
      title: 'Banner 4',
      description: '這是第四個 Banner 的描述'
    }
  ];

  return (
    <>
      <div className={style['banner_demo_page-section']}>
        <h2>基本用法</h2>
        <Banner
          banners={banners}
          value={currentIndex}
          onChange={setCurrentIndex}
          autoplay={true}
          interval={3000}
          height={400}
        />
        <p className={style['banner_demo_page-section-note']}>
          當前索引: {currentIndex}
        </p>
      </div>

      <div className={style['banner_demo_page-section']}>
        <h2>無自動播放</h2>
        <Banner banners={banners} autoplay={false} height={300} />
      </div>

      <div>
        <h2>兩張圖片 (淡入淡出效果)</h2>
        <Banner
          banners={banners.slice(0, 2)}
          autoplay={true}
          interval={2000}
          height={300}
        />
      </div>
    </>
  );
}
