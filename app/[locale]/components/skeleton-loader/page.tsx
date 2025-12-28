import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import DemoSkeletonLoader from '@/components/Demo/SkeletonLoader';

import style from '@/app/[locale]/components/skeleton-loader/page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.skeletonLoader');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

async function SkeletonLoaderDemoPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.skeletonLoader');

  return (
    <section className={style.skeleton_loader_page}>
      <GTMScnOpen />
      <h1>{t('title')}</h1>
      <DemoSkeletonLoader />
    </section>
  );
}

export default SkeletonLoaderDemoPage;
