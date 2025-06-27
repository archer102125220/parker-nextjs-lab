'use client';

import { useCallback, useState } from 'react';

import SwiperJs from '@/components/SwiperJs';
import type { swiperChange, swiperValue } from '@/components/SwiperJs';

import pageStyles from '@/app/[locale]/components/swiper-js/page.module.scss';

const slideList: string[] = [];

for (let i = 0; i <= 100; i++) {
  // _tabList.push(i);
  let slide = '';
  for (let j = i; j >= 0; j--) {
    slide += j;
  }
  slideList.push(slide);
}

export default function SwiperJsDemo() {
  const [slideValue, setSlideValue] = useState<swiperValue>(0);

  const handleSwiperJsChange = useCallback<swiperChange>(
    (newValue, newIndex) => {
      console.log({ newValue });
      setSlideValue(newValue);
    },
    []
  );

  return (
    <main className={pageStyles['swiper_js_page']}>
      <h1>SwiperJs 元件演示</h1>

      <SwiperJs
        className={pageStyles['swiper_js_page-content']}
        shouldFillHeight={true}
        value={slideValue}
        slideList={slideList}
        renderSlide={({ item, index, isSliderMoveing }) => (
          <div className={pageStyles['swiper_js_page-content-slide']}>
            <p>item: {item}</p>
            <p>index: {index}</p>
            <p>isSliderMoveing: {`${isSliderMoveing}`}</p>
          </div>
        )}
        change={handleSwiperJsChange}
      />
    </main>
  );
}
