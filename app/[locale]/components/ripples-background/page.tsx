import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const RipplesBackgroundTestClient = dynamic(
  () => import('@/components/Demo/RipplesBackgroundTest')
);
const GTMScnOpen = dynamic(() => import('@/components/Google/GTMScnOpen'));

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.ripplesBackground');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function RipplesBackgroundPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.ripplesBackground');

  return (
    <div className={style.ripples_background_test_page}>
      <GTMScnOpen />
      <h1 className={style['ripples_background_test_page-title']}>{t('title')}</h1>
      <p className={style['ripples_background_test_page-description']}>
        {t('description')}
      </p>
      <RipplesBackgroundTestClient />
    </div>
  );
}
