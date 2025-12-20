'use client';

import { useState } from 'react';
import SwiperCustom from '@/components/SwiperCustom';

export default function SwiperTestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      content: (
        <div style={{ 
          height: '300px', 
          backgroundColor: '#1976d2', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px'
        }}>
          Slide 1
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div style={{ 
          height: '300px', 
          backgroundColor: '#4caf50', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px'
        }}>
          Slide 2
        </div>
      )
    },
    {
      id: 3,
      content: (
        <div style={{ 
          height: '300px', 
          backgroundColor: '#f44336', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px'
        }}>
          Slide 3
        </div>
      )
    },
    {
      id: 4,
      content: (
        <div style={{ 
          height: '300px', 
          backgroundColor: '#ff9800', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px'
        }}>
          Slide 4
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>SwiperCustom 自訂輪播測試</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        展示自訂 Swiper 輪播組件
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2>基本用法</h2>
        <SwiperCustom
          slides={slides}
          onSlideChange={setCurrentIndex}
          autoplay={true}
        />
        <p style={{ marginTop: '10px', color: '#666' }}>
          當前索引: {currentIndex}
        </p>
      </div>

      <div>
        <h2>無自動播放</h2>
        <SwiperCustom
          slides={slides}
          autoplay={false}
        />
      </div>
    </div>
  );
}
