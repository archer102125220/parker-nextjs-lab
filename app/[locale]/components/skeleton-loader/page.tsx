import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

import DemoSkeletonLoader from '@/components/Demo/SkeletonLoader';

import style from '@/app/[locale]/components/skeleton-loader/page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '載入骨架 元件演示',
    description: '載入骨架 元件演示'
  };
}

function SkeletonLoaderDemoPage(): ReactNode {
  return (
    <section className={style.skeleton_loader_page}>
      <GTMScnOpen />
      <h1>載入骨架 元件演示</h1>
      <DemoSkeletonLoader />
    </section>
  );
}

export default SkeletonLoaderDemoPage;
