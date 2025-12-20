'use client';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import type {
  swiperChange,
  swiperValue,
  SlideProps
} from '@/components/SwiperJs';
import { SwiperJs } from '@/components/SwiperJs';

import { useAppSelector } from '@/store';

import pageStyles from '@/app/[locale]/components/swiper-js/page.module.scss';

const slideList: Array<string> = [];

for (let i: number = 0; i <= 100; i++) {
  // _tabList.push(i);
  let slide: string = '';
  for (let j: number = i; j >= 0; j--) {
    slide += j;
  }
  slideList.push(slide);
}

export function SwiperJsDemo(): ReactNode {
  const nonce = useAppSelector<string>((state) => state.system.nonce);

  const [slideValue, setSlideValue] = useState<swiperValue>(0);

  const handleSwiperJsChange = useCallback<swiperChange>((newValue) => {
    // console.log({ newValue });
    setSlideValue(newValue);
  }, []);

  return (
    <>
      {/* 說明區塊 */}
      <div style={{ 
        padding: '24px', 
        marginBottom: '32px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginTop: 0, color: '#856404' }}>⚠️ 關於此組件</h2>
        
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>📌 為何創建此組件？</h3>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            此自定義 SwiperJs 包裝組件創建於 Swiper 官方 React 組件維護狀態不明確的時期。
            當時為了確保專案穩定性，選擇自行封裝 Swiper 核心庫，以便更好地整合到 React 生態系統中。
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>✅ 目前狀態</h3>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            <strong>好消息！</strong> Swiper 官方 React 組件（swiper/react）現已恢復積極維護（v12.0.3, 2025年10月）。
            因此，此自定義包裝組件已被標記為 <strong>deprecated（已棄用）</strong>。
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>🔧 已知問題</h3>
          <ul style={{ margin: '8px 0', paddingLeft: '24px', lineHeight: '1.6' }}>
            <li>與 React 調和機制的衝突導致性能問題</li>
            {/* <li>手動滑動時的狀態同步延遲</li> */}
            <li>滑動過程中的過度重新渲染</li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>💡 建議</h3>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            <strong>新專案請使用官方 swiper/react 組件。</strong>
            可參考本專案的 <code>TabsContent</code> 組件，該組件已遷移至官方實現，展示了正確的使用方式。
          </p>
        </div>

        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#d1ecf1', 
          border: '1px solid #bee5eb',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#0c5460' }}>
            <strong>📚 學習價值：</strong> 此頁面保留作為「如何封裝第三方庫」和「處理 React 整合挑戰」的參考案例。
            雖然已棄用，但展示了在特殊情況下的解決方案思路。
          </p>
        </div>
      </div>

      {/* SwiperJs Demo */}
      <SwiperJs
        className={pageStyles['swiper_js_page-content']}
        nonce={nonce}
        shouldFillHeight={true}
        value={slideValue}
        slideList={slideList}
        renderSlide={(props: SlideProps): ReactNode => {
          const { item, index, isSliderMoveing } = props;

          return (
            <div className={pageStyles['swiper_js_page-content-slide']}>
              <p>item: {item}</p>
              <p>index: {index}</p>
              <p>isSliderMoveing: {`${isSliderMoveing}`}</p>
            </div>
          );
        }}
        change={handleSwiperJsChange}
      />
    </>
  );
}

export default SwiperJsDemo;
