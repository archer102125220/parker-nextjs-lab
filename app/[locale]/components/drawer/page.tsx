import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import DemoDrawer from '@/components/Demo/Drawer';

import style from '@/app/[locale]/components/drawer/page.module.scss';

const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.drawer');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

async function DrawerDemoPage({ params }: Props): Promise<ReactNode> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.drawer');

  return (
    <section className={style.drawer_page}>
      <GTMScnOpen />
      <h1>{t('title')}</h1>
      <DemoDrawer />
    </section>
  );
}

export default DrawerDemoPage;
