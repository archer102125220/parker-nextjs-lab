import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import style from './page.module.scss';

const SlideInPanelTest = dynamic(
  () => import('@/components/Demo/SlideInPanelTest')
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pages.componentPages.slideInPanel');
  return {
    title: t('title'),
    description: t('description')
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SlideInPanelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.componentPages.slideInPanel');

  return (
    <div className={style.slide_in_panel_test_page}>
      <h1>{t('title')}</h1>
      <p className={style['slide_in_panel_test_page-description']}>
        {t('description')}
      </p>
      <SlideInPanelTest />
    </div>
  );
}
