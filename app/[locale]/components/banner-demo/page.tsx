'use client';

import { useState } from 'react';
import Banner from '@/components/Banner';
import type { BannerItem } from '@/components/Banner';

export default function BannerDemoPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners: BannerItem[] = [
    {
      id: 1,
      image: 'https://picsum.photos/1200/400?random=1',
      title: 'Banner 1',
      description: '這是第一個 Banner 的描述'
    },
    {
      id: 2,
      image: 'https://picsum.photos/1200/400?random=2',
      title: 'Banner 2',
      description: '這是第二個 Banner 的描述'
    },
    {
      id: 3,
      image: 'https://picsum.photos/1200/400?random=3',
      title: 'Banner 3',
      description: '這是第三個 Banner 的描述'
    },
    {
      id: 4,
      image: 'https://picsum.photos/1200/400?random=4',
      title: 'Banner 4',
      description: '這是第四個 Banner 的描述'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Banner 輪播組件測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示 3D 輪播效果、拖曳支援、鍵盤導航和自動播放功能
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>基本用法</h2>
        <Banner
          banners={banners}
          value={currentIndex}
          onChange={setCurrentIndex}
          autoplay={true}
          interval={3000}
          height={400}
        />
        <p style={{ marginTop: '10px', color: '#666' }}>
          當前索引: {currentIndex}
        </p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>無自動播放</h2>
        <Banner
          banners={banners}
          autoplay={false}
          height={300}
        />
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
    </div>
  );
}
