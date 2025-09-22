import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import DemoScrollFetch from '@/components/Demo/ScrollFetch';

import style from '@/app/[locale]/components/scroll-fetch/page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '下拉及無限滾動 元件演示',
    description: '下拉及無限滾動 元件演示'
  };
}

function ScrollFetchDemoPage(): ReactNode {
  return (
    <main className={style.scroll_fetch_page}>
      <GTMScnOpen />
      <h1>下拉及無限滾動 元件演示</h1>
      <DemoScrollFetch />
    </main>
  );
}

export default ScrollFetchDemoPage;
