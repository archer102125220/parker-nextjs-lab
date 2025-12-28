import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const BannerDemoClient = dynamic(() => import('@/components/Demo/BannerDemo'));
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.bannerDemo');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BannerDemoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.bannerDemo');

  return (
    <div className={style.banner_demo_page}>
      <GTMScnOpen />
      <h1>{t('title')}</h1>
      <p className={style['banner_demo_page-description']}>
        {t('description')}
      </p>
      <BannerDemoClient />
    </div>
  );
}
