import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import pageStyles from '@/app/[locale]/components/swiper-js/page.module.scss';

import DemoSwiperJs from '@/components/Demo/SwiperJs';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.swiperJS');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

async function SwiperJsDemoPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.swiperJS');

  return (
    <section className={pageStyles['swiper_js_page']}>
      <GTMScnOpen />
      <h1>{t('title')}</h1>
      <DemoSwiperJs />
    </section>
  );
}

export default SwiperJsDemoPage;
