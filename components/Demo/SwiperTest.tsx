'use client';

import { useState } from 'react';
import SwiperCustom from '@/components/SwiperCustom';
import styles from '@/app/[locale]/components/swiper-test/page.module.scss';

export default function SwiperTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondIndex, setSecondIndex] = useState(0);

  const slideList = [
    { id: 1, slotName: 'slide-1', label: 'Slide 1', color: 'blue' },
    { id: 2, slotName: 'slide-2', label: 'Slide 2', color: 'green' },
    { id: 3, slotName: 'slide-3', label: 'Slide 3', color: 'red' },
    { id: 4, slotName: 'slide-4', label: 'Slide 4', color: 'orange' }
  ];

  const handleChange = (value: unknown) => {
    const index = slideList.findIndex((slide) => slide === value);
    if (index >= 0) {
      setCurrentIndex(index);
    } else if (typeof value === 'number') {
      setCurrentIndex(value);
    }
  };

  const handleSecondChange = (value: unknown) => {
    const index = slideList.findIndex((slide) => slide === value);
    if (index >= 0) {
      setSecondIndex(index);
    } else if (typeof value === 'number') {
      setSecondIndex(value);
    }
  };

  const renderSlide = (
    slide: { id?: string | number; label?: string; color?: string; [key: string]: unknown },
    _index: number,
    _isSliderMoving: boolean
  ) => {
    const color = (slide.color as string) || 'blue';
    return (
      <div className={styles['swiper_test_page-slide']} css-color={color}>
        {slide.label || `Slide ${_index + 1}`}
      </div>
    );
  };

  return (
    <>
      <div className={styles['swiper_test_page-section']}>
        <h2 className={styles['swiper_test_page-section_title']}>基本用法</h2>
        <SwiperCustom
          value={currentIndex}
          slideList={slideList}
          hasNavigation={true}
          shouldFillHeight={true}
          onChange={handleChange}
          renderSlide={renderSlide}
        />
        <p className={styles['swiper_test_page-slide_info']}>
          當前索引: {currentIndex}
        </p>
      </div>

      <div className={styles['swiper_test_page-section']}>
        <h2 className={styles['swiper_test_page-section_title']}>無導航按鈕</h2>
        <SwiperCustom
          value={secondIndex}
          slideList={slideList}
          hasNavigation={false}
          shouldFillHeight={true}
          onChange={handleSecondChange}
          renderSlide={renderSlide}
        />
        <p className={styles['swiper_test_page-slide_info']}>
          當前索引: {secondIndex}
        </p>
      </div>
    </>
  );
}
