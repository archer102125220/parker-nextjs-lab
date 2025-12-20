import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import pageStyles from '@/app/[locale]/components/swiper-js/page.module.scss';

import DemoSwiperJs from '@/components/Demo/SwiperJs';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Swiper.js 元件演示',
    description: 'Swiper.js 元件演示'
  };
}

function SwiperJsDemoPage(): ReactNode {
  return (
    <section className={pageStyles['swiper_js_page']}>
      <GTMScnOpen />
      <h1>SwiperJs 自定義包裝組件</h1>
      <DemoSwiperJs />
    </section>
  );
}

export default SwiperJsDemoPage;
