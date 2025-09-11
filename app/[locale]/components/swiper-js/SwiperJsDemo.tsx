'use client';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import type {
  swiperChange,
  swiperValue,
  SlideProps
} from '@/components/SwiperJs';
import SwiperJs from '@/components/SwiperJs';

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
  const [slideValue, setSlideValue] = useState<swiperValue>(0);

  const handleSwiperJsChange = useCallback<swiperChange>((newValue) => {
    console.log({ newValue });
    setSlideValue(newValue);
  }, []);

  return (
    <>
      <SwiperJs
        className={pageStyles['swiper_js_page-content']}
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
