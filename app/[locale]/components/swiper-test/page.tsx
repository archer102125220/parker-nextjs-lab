'use client';

import { useState } from 'react';
import SwiperCustom from '@/components/SwiperCustom';

import styles from './page.module.scss';

export default function SwiperTestPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      content: (
        <div
          className={`${styles['swiper_test_page-slide']} ${styles['swiper_test_page-slide--blue']}`}
        >
          Slide 1
        </div>
      )
    },
    {
      id: 2,
      content: (
        <div
          className={`${styles['swiper_test_page-slide']} ${styles['swiper_test_page-slide--green']}`}
        >
          Slide 2
        </div>
      )
    },
    {
      id: 3,
      content: (
        <div
          className={`${styles['swiper_test_page-slide']} ${styles['swiper_test_page-slide--red']}`}
        >
          Slide 3
        </div>
      )
    },
    {
      id: 4,
      content: (
        <div
          className={`${styles['swiper_test_page-slide']} ${styles['swiper_test_page-slide--orange']}`}
        >
          Slide 4
        </div>
      )
    }
  ];

  return (
    <section className={styles.swiper_test_page}>
      <h1>SwiperCustom 自訂輪播測試</h1>
      <p className={styles['swiper_test_page-description']}>
        展示自訂 Swiper 輪播組件
      </p>

      <div className={styles['swiper_test_page-section']}>
        <h2 className={styles['swiper_test_page-section_title']}>基本用法</h2>
        <SwiperCustom
          slides={slides}
          onSlideChange={setCurrentIndex}
          autoplay={true}
        />
        <p className={styles['swiper_test_page-slide_info']}>
          當前索引: {currentIndex}
        </p>
      </div>

      <div className={styles['swiper_test_page-section']}>
        <h2 className={styles['swiper_test_page-section_title']}>無自動播放</h2>
        <SwiperCustom slides={slides} autoplay={false} />
      </div>
    </section>
  );
}
