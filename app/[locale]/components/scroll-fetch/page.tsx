import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import DemoScrollFetch from '@/components/Demo/ScrollFetch';

import style from '@/app/[locale]/components/scroll-fetch/page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.scrollFetch');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

async function ScrollFetchDemoPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.scrollFetch');

  return (
    <section className={style.scroll_fetch_page}>
      <GTMScnOpen />
      <h1>{t('title')}</h1>
      <DemoScrollFetch />
    </section>
  );
}

export default ScrollFetchDemoPage;
