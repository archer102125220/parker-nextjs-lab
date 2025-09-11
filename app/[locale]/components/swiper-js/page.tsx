import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import pageStyles from '@/app/[locale]/components/swiper-js/page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));
const SwiperJsDemo = dynamic(() => import('./SwiperJsDemo'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Swiper.js 元件演示',
    description: 'Swiper.js 元件演示'
  };
}

export function SwiperJsDemoPage(): ReactNode {
  return (
    <main className={pageStyles['swiper_js_page']}>
      <GTMScnOpen />
      <h1>SwiperJs 元件演示</h1>
      <SwiperJsDemo />
    </main>
  );
}

export default SwiperJsDemoPage;
